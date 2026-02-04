import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { CollectionEntry } from "astro:content";

interface HomePostsProps {
    posts: CollectionEntry<"posts">[];
}

export default function HomePosts({ posts }: HomePostsProps) {
    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 py-8 text-zinc-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-8 ml-5">
                <h1 className="text-3xl font-bold text-white">Blogs</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-5">
                {posts.map((post, index) => (
                    <motion.a
                        key={post.id}
                        href={`/blog/${post.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group flex flex-col justify-between p-6 bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:bg-zinc-900/50 rounded-xl h-full"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-mono leading-tight flex-1 mr-4">
                                    {post.data.title}
                                </h3>
                                <span className="text-xs font-mono text-zinc-500 whitespace-nowrap pt-1">
                                    {post.data.pubDate.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }).replace(/\//g, "-")}
                                </span>
                            </div>

                            {post.data.description && (
                                <p className="text-zinc-400 text-sm font-mono leading-relaxed line-clamp-3 mb-6">
                                    {post.data.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center text-sm font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors mt-auto">
                            Read more <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </motion.a>
                ))}
            </div>

            <div className="flex justify-center mt-12 ml-5">
                <a
                    href="/blog"
                    className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all rounded-sm font-mono"
                >
                    Show All Posts
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            </div>
        </motion.div>
    );
}
