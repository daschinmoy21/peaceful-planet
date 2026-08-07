export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface GitHubContribution {
  date: string;
  count: number;
  level: ContributionLevel;
}

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

export interface GitHubRepositoryActivity {
  name: string;
  count: number;
  href: string;
  stars: number;
  logo?: string;
}

export type GitHubCalendarCell = GitHubContribution | null;

export interface GitHubActivityData {
  contributions: GitHubContribution[];
  weeks: GitHubCalendarCell[][];
  monthLabels: { label: string; column: number }[];
  total: number;
  year: number | null;
  prs: GitHubPR[];
  repositories: GitHubRepositoryActivity[];
}

const GITHUB_USER = "daschinmoy21";
const MIN_STARS = 100;
const PR_SEARCH_BASE = `author:${GITHUB_USER} type:pr -user:${GITHUB_USER}`;
const PR_SEARCH_GRAPHQL = `${PR_SEARCH_BASE} sort:updated-desc`;
const CONTRIBUTION_CALENDAR_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
  const fromProcess =
    typeof process !== "undefined" ? process.env[name] : undefined;
  const fromVite = (import.meta.env as Record<string, string | undefined> | undefined)?.[name];
  const value = fromProcess || fromVite;
  return value && value.length > 0 ? value : undefined;
}

function getGithubToken(): string | undefined {
  return readEnv("GH_PAT") || readEnv("GH_TOKEN") || readEnv("GITHUB_TOKEN");
}

function getGithubHeaders(): Record<string, string> {
  const token = getGithubToken();
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "peaceful-planet",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function emptyActivity(): GitHubActivityData {
  return {
    contributions: [],
    weeks: [],
    monthLabels: [],
    total: 0,
    year: null,
    prs: [],
    repositories: [],
  };
}

function normalizeLevel(level: unknown): ContributionLevel {
  const value = Number(level);
  if (!Number.isFinite(value)) return 0;
  return Math.min(4, Math.max(0, Math.round(value))) as ContributionLevel;
}

export function normalizeContributions(body: unknown): GitHubContribution[] {
  const rawContributions =
    body && typeof body === "object" && "contributions" in body
      ? (body as { contributions?: unknown }).contributions
      : undefined;

  if (!Array.isArray(rawContributions)) return [];

  return rawContributions
    .map((raw) => {
      const contribution =
        raw && typeof raw === "object"
          ? (raw as { date?: unknown; count?: unknown; level?: unknown })
          : {};
      const date = String(contribution.date ?? "");
      const count = Number(contribution.count);

      return {
        date,
        count: Number.isFinite(count) ? Math.max(0, count) : 0,
        level: normalizeLevel(contribution.level),
      };
    })
    .filter((contribution) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(contribution.date)) return false;
      const date = new Date(`${contribution.date}T00:00:00Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === contribution.date
      );
    })
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function toWeeks(
  contributions: GitHubContribution[],
): GitHubCalendarCell[][] {
  if (contributions.length === 0) return [];

  const firstDay = new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay();
  const cells: GitHubCalendarCell[] = [
    ...Array<null>(firstDay).fill(null),
    ...contributions,
  ];
  const trailingEmptyCells = (7 - (cells.length % 7)) % 7;
  cells.push(...Array<null>(trailingEmptyCells).fill(null));

  return Array.from(
    { length: cells.length / 7 },
    (_, index) => cells.slice(index * 7, index * 7 + 7),
  );
}

export function getMonthLabels(weeks: GitHubCalendarCell[][]) {
  const labels: { label: string; column: number }[] = [];
  const seen = new Set<string>();
  const firstWeek = weeks[0] ?? [];
  const firstWeekMonthStart = firstWeek.find(
    (contribution) => contribution?.date.slice(8, 10) === "01",
  );
  const firstContribution = firstWeek.find(Boolean);

  if (!firstWeekMonthStart && firstContribution) {
    const month = firstContribution.date.slice(0, 7);
    seen.add(month);
    labels.push({
      label: MONTH_NAMES[Number(month.slice(5, 7)) - 1] ?? "",
      column: 0,
    });
  }

  weeks.forEach((week, column) => {
    const monthStart = week.find(
      (contribution) => contribution?.date.slice(8, 10) === "01",
    );
    if (!monthStart) return;

    const month = monthStart.date.slice(0, 7);
    if (seen.has(month)) return;
    seen.add(month);
    labels.push({
      label: MONTH_NAMES[Number(month.slice(5, 7)) - 1] ?? "",
      column,
    });
  });

  return labels;
}

async function fetchContributions(): Promise<GitHubActivityData> {
  try {
    const response = await fetch(CONTRIBUTION_CALENDAR_API);
    if (!response.ok) {
      throw new Error(`Contribution API failed: ${response.status}`);
    }

    const contributions = normalizeContributions(await response.json());
    const weeks = toWeeks(contributions);

    return {
      contributions,
      weeks,
      monthLabels: getMonthLabels(weeks),
      total: contributions.reduce(
        (sum, contribution) => sum + contribution.count,
        0,
      ),
      year: contributions.length
        ? Number(contributions.at(-1)?.date.slice(0, 4))
        : null,
      prs: [],
      repositories: [],
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return emptyActivity();
  }
}

function mapGraphQLNode(node: any): GitHubPR | null {
  if (!node?.repository || !node.title) return null;
  const stars = Number(node.repository.stargazerCount ?? 0);
  if (!Number.isFinite(stars) || stars < MIN_STARS) return null;

  return {
    id: String(node.id),
    title: node.title,
    state: String(node.state ?? "").toLowerCase() === "open" ? "open" : "closed",
    html_url: node.url,
    created_at: node.createdAt,
    closed_at: node.closedAt ?? null,
    merged_at: node.mergedAt ?? null,
    number: node.number,
    repo: {
      name: node.repository.name,
      full_name: node.repository.nameWithOwner,
      html_url: node.repository.url,
      stars,
    },
  };
}

async function fetchViaGraphQL(
  headers: Record<string, string>,
): Promise<GitHubPR[]> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query: GRAPHQL_QUERY }),
  });
  if (!response.ok) {
    throw new Error(`GraphQL failed: ${response.status}`);
  }

  const body = await response.json();
  if (body.errors?.length) throw new Error(JSON.stringify(body.errors));

  return (body.data?.search?.nodes ?? [])
    .map(mapGraphQLNode)
    .filter((pr: GitHubPR | null): pr is GitHubPR => pr !== null);
}

async function fetchRepoStars(
  repositories: string[],
  headers: Record<string, string>,
): Promise<Map<string, number>> {
  const stars = new Map<string, number>();

  await Promise.all(
    [...new Set(repositories)].map(async (repository) => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repository}`,
          { headers },
        );
        if (!response.ok) return;
        const body = await response.json();
        const count = Number(body.stargazers_count);
        if (Number.isFinite(count)) stars.set(repository, count);
      } catch (error) {
        console.warn(`Failed to fetch stars for ${repository}:`, error);
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
  const response = await fetch(
    `https://api.github.com/search/issues?${params}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(`REST search failed: ${response.status}`);
  }

  const body = await response.json();
  const rawItems: any[] = body.items ?? [];
  const repositoryNames = rawItems
    .map((item) =>
      item?.repository_url
        ? item.repository_url.replace("https://api.github.com/repos/", "")
        : null,
    )
    .filter((repository): repository is string => Boolean(repository));
  const repoStars = await fetchRepoStars(repositoryNames, headers);

  return rawItems.flatMap((item) => {
    if (!item?.repository_url) return [];
    const fullName = item.repository_url.replace(
      "https://api.github.com/repos/",
      "",
    );
    const stars = repoStars.get(fullName);
    if (stars === undefined || stars < MIN_STARS) return [];

    return [
      {
        id: String(item.id),
        title: item.title,
        state: item.state as GitHubPR["state"],
        html_url: item.html_url,
        created_at: item.created_at,
        closed_at: item.closed_at || null,
        merged_at: item.pull_request?.merged_at ?? null,
        number: item.number,
        repo: {
          name: fullName.split("/").at(-1) ?? fullName,
          full_name: fullName,
          html_url: `https://github.com/${fullName}`,
          stars,
        },
      },
    ];
  });
}

let prsCached: Promise<GitHubPR[]> | null = null;

async function fetchGitHubPRs(): Promise<GitHubPR[]> {
  if (prsCached) return prsCached;

  const headers = getGithubHeaders();
  prsCached = (async () => {
    const token = getGithubToken();
    if (token) {
      try {
        return await fetchViaGraphQL(headers);
      } catch (error) {
        console.warn("GitHub GraphQL PR search failed, using REST:", error);
      }
    }
    return fetchViaRest(headers);
  })().catch((error) => {
    prsCached = null;
    throw error;
  });

  return prsCached;
}

export function getRepositories(prs: GitHubPR[]): GitHubRepositoryActivity[] {
  const repositories = new Map<string, GitHubRepositoryActivity>();

  for (const pr of prs) {
    const current = repositories.get(pr.repo.full_name);
    if (current) {
      current.count += 1;
      continue;
    }

    const [owner, name] = pr.repo.full_name.split("/");
    repositories.set(pr.repo.full_name, {
      name: name || pr.repo.full_name,
      count: 1,
      href: pr.repo.html_url,
      stars: pr.repo.stars,
      logo: owner ? `https://github.com/${owner}.png?size=64` : undefined,
    });
  }

  return [...repositories.values()]
    .sort(
      (first, second) =>
        second.count - first.count ||
        second.stars - first.stars ||
        first.name.localeCompare(second.name),
    )
    .slice(0, 12);
}

let activityCached: Promise<GitHubActivityData> | null = null;

export async function fetchGitHubActivity(): Promise<GitHubActivityData> {
  if (activityCached) return activityCached;

  activityCached = Promise.all([
    fetchContributions(),
    fetchGitHubPRs().catch((error) => {
      console.error("Failed to fetch GitHub pull requests:", error);
      return [];
    }),
  ]).then(([activity, prs]) => ({
    ...activity,
    prs,
    repositories: getRepositories(prs),
  }))
    .catch((error) => {
      activityCached = null;
      throw error;
    });

  return activityCached;
}
