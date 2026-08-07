import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchGitHubActivity,
  getMonthLabels,
  getRepositories,
  normalizeContributions,
  toWeeks,
  type GitHubContribution,
  type GitHubPR,
} from "./github.ts";

const contribution = (date: string, count = 1): GitHubContribution => ({
  date,
  count,
  level: 1,
});

const pullRequest = (
  fullName: string,
  count = 1,
  stars = 100,
): GitHubPR[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${fullName}-${index}`,
    title: `PR ${index}`,
    state: "closed",
    html_url: `https://github.com/${fullName}/pull/${index + 1}`,
    created_at: "2025-01-01T00:00:00Z",
    closed_at: "2025-01-02T00:00:00Z",
    merged_at: null,
    number: index + 1,
    repo: {
      name: fullName.split("/").at(-1) ?? fullName,
      full_name: fullName,
      html_url: `https://github.com/${fullName}`,
      stars,
    },
  }));

test("normalizes contribution data and rejects malformed dates", () => {
  assert.deepEqual(
    normalizeContributions({
      contributions: [
        { date: "2025-01-02", count: "3", level: 5 },
        { date: "2025-01-01", count: -2, level: -1 },
        { date: "2025-02-30", count: 4, level: 2 },
        { date: "not-a-date", count: 4, level: 2 },
        null,
      ],
    }),
    [
      { date: "2025-01-01", count: 0, level: 0 },
      { date: "2025-01-02", count: 3, level: 4 },
    ],
  );
});

test("pads a range that begins mid-week without dropping contributions", () => {
  const contributions = [
    contribution("2025-01-01"),
    contribution("2025-01-02"),
    contribution("2025-01-03"),
    contribution("2025-01-04"),
  ];
  const weeks = toWeeks(contributions);

  assert.equal(weeks.length, 1);
  assert.deepEqual(weeks[0].slice(0, 3), [null, null, null]);
  assert.deepEqual(weeks[0].slice(3), contributions);
  assert.equal(weeks.flat().filter(Boolean).length, contributions.length);
});

test("labels the first visible month and handles a year boundary", () => {
  const dates = Array.from({ length: 33 }, (_, index) => {
    const date = new Date(Date.UTC(2024, 11, 31 + index));
    return contribution(date.toISOString().slice(0, 10));
  });
  const labels = getMonthLabels(toWeeks(dates));

  assert.deepEqual(labels, [
    { label: "Jan", column: 0 },
    { label: "Feb", column: 4 },
  ]);

  assert.deepEqual(
    getMonthLabels(
      toWeeks([
        contribution("2025-01-02"),
        contribution("2025-01-03"),
      ]),
    ),
    [{ label: "Jan", column: 0 }],
  );
});

test("aggregates repositories by PR count and applies deterministic sorting", () => {
  const repositories = getRepositories([
    ...pullRequest("owner/alpha", 2, 100),
    ...pullRequest("owner/beta", 2, 200),
    ...pullRequest("owner/gamma", 1, 500),
  ]);

  assert.deepEqual(
    repositories.map(({ name, count, stars }) => ({ name, count, stars })),
    [
      { name: "beta", count: 2, stars: 200 },
      { name: "alpha", count: 2, stars: 100 },
      { name: "gamma", count: 1, stars: 500 },
    ],
  );
});

test("keeps contributions when PR fetching fails", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("github-contributions-api")) {
      return new Response(
        JSON.stringify({
          contributions: [{ date: "2025-01-01", count: 2, level: 2 }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response("PR search failed", { status: 500 });
  };

  try {
    const activity = await fetchGitHubActivity();
    assert.equal(activity.total, 2);
    assert.equal(activity.prs.length, 0);
    assert.equal(activity.repositories.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
