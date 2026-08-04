export interface GitHubPR {
  id: string;
  title: string;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  number: number;
  repo: {
    name: string;
    full_name: string;
    html_url: string;
    stars: number;
  };
}

const MIN_STARS = 100;
const GITHUB_USER = "daschinmoy21";

/** Exclude own repos so personal project PRs don't flood the window before star filtering. */
const PR_SEARCH_BASE = `author:${GITHUB_USER} type:pr -user:${GITHUB_USER}`;
/** GraphQL Search accepts sort qualifiers in the query string. */
const PR_SEARCH_GRAPHQL = `${PR_SEARCH_BASE} sort:updated-desc`;

const GRAPHQL_QUERY = `
query {
  search(query: "${PR_SEARCH_GRAPHQL}", type: ISSUE, first: 50) {
    nodes {
      ... on PullRequest {
        id
        title
        state
        url
        createdAt
        closedAt
        mergedAt
        number
        repository {
          nameWithOwner
          name
          url
          stargazerCount
        }
      }
    }
  }
}`;

function readEnv(name: string): string | undefined {
  // CI / Node inject process.env; Vite/Astro also expose .env via import.meta.env.
  const fromProcess =
    typeof process !== "undefined" ? process.env[name] : undefined;
  const fromVite = (import.meta.env as Record<string, string | undefined>)[name];
  const value = fromProcess || fromVite;
  return value && value.length > 0 ? value : undefined;
}

function getGithubToken(): string | undefined {
  // Prefer a PAT if set (higher rate limits); fall back to Actions GITHUB_TOKEN.
  return readEnv("GH_PAT") || readEnv("GH_TOKEN") || readEnv("GITHUB_TOKEN");
}

/** Single-flight so home + /oss share one result during the static build. */
let _cached: Promise<GitHubPR[]> | null = null;

export async function fetchGitHubPRs(): Promise<GitHubPR[]> {
  if (_cached) return _cached;
  _cached = _fetchGitHubPRs().catch((err) => {
    // Allow a later page to retry if this attempt failed hard.
    _cached = null;
    throw err;
  });
  return _cached;
}

function logPrSummary(source: string, prs: GitHubPR[]): GitHubPR[] {
  const sample = prs
    .slice(0, 3)
    .map((p) => `${p.repo.full_name}★${p.repo.stars}`)
    .join(", ");
  console.log(
    `[github] ${source}: ${prs.length} PRs with ≥${MIN_STARS} stars` +
      (sample ? ` (e.g. ${sample})` : ""),
  );
  return prs;
}

async function _fetchGitHubPRs(): Promise<GitHubPR[]> {
  const token = getGithubToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "peaceful-planet",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("[github] using authenticated GitHub API");
  } else {
    console.warn(
      "[github] no GITHUB_TOKEN/GH_TOKEN — unauthenticated rate limits may drop star counts",
    );
  }

  // Prefer GraphQL: one request returns PRs + stargazerCount (no N+1).
  if (token) {
    try {
      return logPrSummary("GraphQL", await fetchViaGraphQL(headers));
    } catch (err) {
      console.error(
        "[github] GraphQL PR fetch failed, falling back to REST:",
        err,
      );
    }
  }

  return logPrSummary("REST", await fetchViaRest(headers));
}

function mapGraphQLNode(n: any): GitHubPR | null {
  if (!n?.repository || !n.title) return null;
  const stars = Number(n.repository.stargazerCount ?? 0);
  if (!Number.isFinite(stars) || stars < MIN_STARS) return null;

  // GraphQL uses OPEN | CLOSED | MERGED; UI only models open | closed.
  const raw = String(n.state ?? "").toLowerCase();
  const state: GitHubPR["state"] = raw === "open" ? "open" : "closed";

  return {
    id: String(n.id),
    title: n.title,
    state,
    html_url: n.url,
    created_at: n.createdAt,
    closed_at: n.closedAt ?? null,
    merged_at: n.mergedAt ?? null,
    number: n.number,
    repo: {
      name: n.repository.name,
      full_name: n.repository.nameWithOwner,
      html_url: n.repository.url,
      stars,
    },
  };
}

async function fetchViaGraphQL(
  headers: Record<string, string>,
): Promise<GitHubPR[]> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GraphQL failed: ${res.status} ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));

  const nodes: any[] = json.data?.search?.nodes ?? [];
  return nodes
    .map(mapGraphQLNode)
    .filter((p: GitHubPR | null): p is GitHubPR => p !== null);
}

/** Fetch stargazer counts for unique repos (parallel, cached). */
async function fetchRepoStars(
  repos: string[],
  headers: Record<string, string>,
): Promise<Map<string, number>> {
  const unique = [...new Set(repos)];
  const stars = new Map<string, number>();

  await Promise.all(
    unique.map(async (repoFull) => {
      try {
        const rr = await fetch(`https://api.github.com/repos/${repoFull}`, {
          headers,
        });
        if (!rr.ok) {
          console.warn(
            `[github] repo stars failed for ${repoFull}: HTTP ${rr.status}`,
          );
          // Do not store 0 — unknown is different from a true zero-star repo.
          return;
        }
        const body = await rr.json();
        const count = Number(body.stargazers_count);
        if (Number.isFinite(count)) stars.set(repoFull, count);
      } catch (err) {
        console.warn(`[github] repo stars error for ${repoFull}:`, err);
      }
    }),
  );

  return stars;
}

async function fetchViaRest(
  headers: Record<string, string>,
): Promise<GitHubPR[]> {
  const params = new URLSearchParams({
    q: PR_SEARCH_BASE,
    sort: "updated",
    order: "desc",
    per_page: "50",
  });
  const restHeaders = {
    ...headers,
    Accept: "application/vnd.github+json",
  };

  const res = await fetch(
    `https://api.github.com/search/issues?${params}`,
    { headers: restHeaders },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`REST search failed: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const rawItems: any[] = data.items ?? [];

  const repoNames = rawItems
    .map((item) =>
      item?.repository_url
        ? item.repository_url.replace("https://api.github.com/repos/", "")
        : null,
    )
    .filter((r: string | null): r is string => !!r);

  const repoStars = await fetchRepoStars(repoNames, restHeaders);

  if (repoStars.size === 0 && rawItems.length > 0) {
    console.error(
      "[github] could not load any repo star counts — refusing to render ★0 placeholders",
    );
    return [];
  }

  const items: GitHubPR[] = [];
  for (const item of rawItems) {
    if (!item?.repository_url) continue;

    const repoFull = item.repository_url.replace(
      "https://api.github.com/repos/",
      "",
    );

    // Skip when star count is unknown (rate limit) or below threshold.
    if (!repoStars.has(repoFull)) continue;
    const stars = repoStars.get(repoFull)!;
    if (stars < MIN_STARS) continue;

    // Search results already include pull_request.merged_at — no N+1 fetch.
    const mergedAt: string | null = item.pull_request?.merged_at ?? null;

    items.push({
      id: String(item.id),
      title: item.title,
      state: item.state as GitHubPR["state"],
      html_url: item.html_url,
      created_at: item.created_at,
      closed_at: item.closed_at || null,
      merged_at: mergedAt,
      number: item.number,
      repo: {
        name: repoFull.split("/").slice(-1)[0],
        full_name: repoFull,
        html_url: `https://github.com/${repoFull}`,
        stars,
      },
    });
  }
  return items;
}

let _contribCached: Promise<string> | null = null;

export async function fetchGitHubContributionsTable(): Promise<string> {
  if (_contribCached) return _contribCached;
  const promise = (async () => {
    try {
      const res = await fetch(
        `https://github.com/users/${GITHUB_USER}/contributions`,
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const html = await res.text();
      const tableMatch = html.match(
        /<table[^>]*ContributionCalendar-grid[^>]*>([\s\S]*?)<\/table>/,
      );
      if (!tableMatch) return "";
      return tableMatch[0]
        .replace(/\s*data-hydro-click="[^"]*"/g, "")
        .replace(/\s*data-hydro-click-hmac="[^"]*"/g, "")
        .replace(/\s*id="[^"]*"/g, "");
    } catch (err) {
      console.error("Failed to fetch GitHub contributions:", err);
      return "";
    }
  })();
  _contribCached = promise;
  return promise;
}
