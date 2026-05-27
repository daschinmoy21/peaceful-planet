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

const GRAPHQL_QUERY = `
query {
  search(query: "author:daschinmoy21 type:pr sort:updated-desc", type: ISSUE, first: 30) {
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

let _cached: Promise<GitHubPR[]> | null = null;

export async function fetchGitHubPRs(): Promise<GitHubPR[]> {
  if (import.meta.env.DEV && _cached) return _cached;
  const promise = _fetchGitHubPRs();
  if (import.meta.env.DEV) _cached = promise;
  return promise;
}

async function _fetchGitHubPRs(): Promise<GitHubPR[]> {
  const token = import.meta.env.GITHUB_TOKEN as string | undefined;

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": "peaceful-planet",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: GRAPHQL_QUERY }),
    });
    if (!res.ok) throw new Error(`GraphQL failed: ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    const nodes = json.data?.search?.nodes ?? [];
    return nodes
      .filter((n: any) => (n.repository?.stargazerCount ?? 0) >= MIN_STARS)
      .map((n: any) => ({
        id: n.id,
        title: n.title,
        state: n.state.toLowerCase() as GitHubPR["state"],
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
      }));
  }

  const params = new URLSearchParams({
    q: "author:daschinmoy21 type:pr",
    sort: "updated",
    order: "desc",
    per_page: "10",
  });
  headers["Accept"] = "application/vnd.github+json";

  const res = await fetch(
    `https://api.github.com/search/issues?${params}`,
    { headers },
  );
  if (!res.ok) throw new Error(`REST failed: ${res.status}`);

  const data = await res.json();
  const repoStars = new Map<string, number>();
  const items: GitHubPR[] = [];

  for (const item of data.items) {
    const repoFull = item.repository_url.replace(
      "https://api.github.com/repos/",
      "",
    );
    if (!repoStars.has(repoFull)) {
      try {
        const rr = await fetch(`https://api.github.com/repos/${repoFull}`, { headers });
        repoStars.set(repoFull, rr.ok ? ((await rr.json()).stargazers_count ?? 0) : 0);
      } catch {
        repoStars.set(repoFull, 0);
      }
    }
    const stars = repoStars.get(repoFull) ?? 0;
    if (stars < MIN_STARS) continue;

    let mergedAt: string | null = null;
    if (item.state === "closed" && item.pull_request) {
      try {
        const prRes = await fetch(item.pull_request.url, { headers });
        if (prRes.ok) mergedAt = (await prRes.json()).merged_at || null;
      } catch { /* skip */ }
    }

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
      const res = await fetch("https://github.com/users/daschinmoy21/contributions");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const html = await res.text();
      const tableMatch = html.match(/<table[^>]*ContributionCalendar-grid[^>]*>([\s\S]*?)<\/table>/);
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

