import React from "react";
import { motion } from "framer-motion";
import { GitPullRequest, Star, ExternalLink, ArrowUpRight } from "lucide-react";

interface GHPR {
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

function getPRStatus(pr: GHPR) {
  if (pr.merged_at) {
    return {
      label: "Merged",
      color: "text-purple-400 border-purple-700/50 bg-purple-900/20",
    };
  }
  if (pr.state === "open") {
    return {
      label: "Open",
      color: "text-green-400 border-green-700/50 bg-green-900/20",
    };
  }
  return {
    label: "Closed",
    color: "text-red-400 border-red-700/50 bg-red-900/20",
  };
}

interface OpenSourceProps {
  prs: GHPR[];
  limit?: number;
}

export default function OpenSource({ prs, limit }: OpenSourceProps) {
  const visiblePRs = limit ? prs.slice(0, limit) : prs;
  const hasMore = limit && prs.length > limit;

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8 text-zinc-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 ml-5 text-white w-fit">
        Open Source
      </h1>

      {visiblePRs.length > 0 && (
        <div className="ml-5 space-y-3">
          {visiblePRs.map((pr, index) => {
            const status = getPRStatus(pr);
            return (
              <motion.a
                key={pr.id}
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-300 rounded-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <GitPullRequest className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors truncate font-mono">
                      {pr.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 pl-6">
                    <a
                      href={pr.repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {pr.repo.full_name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="flex items-center gap-1 text-yellow-500/80">
                      <Star className="w-3 h-3" />
                      {pr.repo.stars.toLocaleString()}
                    </span>
                    <span>#{pr.number}</span>
                    <span>
                      {new Date(pr.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-medium border ${status.color}`}
                >
                  {status.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      )}

      {prs.length === 0 && (
        <div className="ml-5 text-center py-12 text-zinc-500 font-mono text-sm">
          No open source contributions found.
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-10 ml-5">
          <a
            href="/oss"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:text-white hover:-translate-y-0.5 transition-all rounded-sm font-mono"
          >
            View All PRs
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
