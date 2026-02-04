import React from "react";
import { motion } from "framer-motion";
import { GitPullRequest } from "lucide-react";

const contributions = [
    {
        project: "Tokio",
        role: "Contributor",
        language: "Rust",
        description:
            "Enhanced the `#[tokio::main]` procedural macro to provide distinct, context-aware error messages for return type mismatches, significantly improving debugging for async entry points.",
        link: "https://github.com/tokio-rs/tokio/pull/7856",
    },
    {
        project: "Walker",
        role: "Contributor",
        language: "Rust",
        description:
            "Engineered an asynchronous image processing pipeline with caching and downscaling, eliminating UI thread blocking and ensuring smooth performance for the runner used in DHH's Omarchy.",
        link: "https://github.com/abenz1267/walker/pull/561",
    },
];

export default function OpenSource() {
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

            <div className="space-y-6 ml-5">
                {contributions.map((contrib, index) => (
                    <div
                        key={index}
                        className="relative pl-8 border-l border-zinc-700/50 hover:border-zinc-500 transition-colors group"
                    >
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-zinc-900 group-hover:bg-purple-500 transition-colors"></div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                <a
                                    href={contrib.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    {contrib.project}
                                    <GitPullRequest className="w-4 h-4 text-zinc-500 hover:text-blue-400 transition-colors" />
                                </a>
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">
                                    {contrib.language}
                                </span>
                                <span className="text-sm font-mono text-white">
                                    {contrib.role}
                                </span>
                            </div>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {contrib.description}
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
