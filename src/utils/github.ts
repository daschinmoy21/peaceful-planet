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

function getGithubToken(): string | undefined {
  // CI injects process.env; local .env is loaded into import.meta.env by Vite.
  const fromProcess =
    typeof process !== "undefined" ? process.env.GITHUB_TOKEN : undefined;
  const fromVite = import.meta.env.GITHUB_TOKEN as string | undefined;
  const token = fromProcess || fromVite;
  return token && token.length > 0 ? token : undefined;
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

async function _fetchGitHubPRs(): Promise<GitHubPR[]> {
  const token = getGithubToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "peaceful-planet",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  if (token) {
    try {
      return await fetchViaGraphQL(headers);
    } catch (err) {
      console.error("[github] GraphQL PR fetch failed, falling back to REST:", err);
    }
  }

  return fetchViaRest(headers);
}

async function fetchViaGraphQL(
  headers: Record<string, string>,
): Promise<GitHubPR[]> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query: GRAPHQL_QUERY }),
  });
  if (!res.ok) throw new Error(`GraphQL failed: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));

  const nodes = (json.data?.search?.nodes ?? []).filter(
    (n: any) => n && n.repository && n.title,
  );

  return nodes
    .filter((n: any) => (n.repository?.stargazerCount ?? 0) >= MIN_STARS)
    .map((n: any) => {
      // GraphQL uses OPEN | CLOSED | MERGED; UI only models open | closed.
      const raw = String(n.state ?? "").toLowerCase();
      const state: GitHubPR["state"] = raw === "open" ? "open" : "closed";
      return {
        id: n.id,
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
          stars: n.repository.stargazerCount,
        },
      };
    });
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
  if (!res.ok) throw new Error(`REST failed: ${res.status}`);

  const data = await res.json();
  const items: GitHubPR[] = [];
  const repoStars = new Map<string, number>();

  for (const item of data.items ?? []) {
    if (!item?.repository_url) continue;

    const repoFull = item.repository_url.replace(
      "https://api.github.com/repos/",
      "",
    );

    if (!repoStars.has(repoFull)) {
      try {
        const rr = await fetch(`https://api.github.com/repos/${repoFull}`, {
          headers: restHeaders,
        });
        repoStars.set(
          repoFull,
          rr.ok ? ((await rr.json()).stargazers_count ?? 0) : 0,
        );
      } catch {
        repoStars.set(repoFull, 0);
      }
    }

    const stars = repoStars.get(repoFull) ?? 0;
    if (stars < MIN_STARS) continue;

    // Search results already include pull_request.merged_at — no N+1 fetch.
    const mergedAt: string | null =
      item.pull_request?.merged_at ?? null;

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
