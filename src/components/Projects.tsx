
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from "framer-motion";

const projects = [
    {
        title: 'Logia',
        description: 'A modern notes app that transcribes lectures,in-built canvas and AI features.Available for Windows,Linux and MacOS.',
        tags: ['React', 'Rust', 'Python', 'TS', 'C#'],
        link: '#',
        image: '/logia.webp'
    },
    {
        title: 'Lightspeed',
        description: 'P2P file sharing on local netowrks using TCP and QUIC.~40% faster than LocalSend and QuickShare.',
        tags: ['Go', 'Docker', 'Kubernetes'],
        link: '#',
        image: '/lightspeed.png'
    },
    {
        title: 'Gamma UI',
        description: 'A beautiful and responsive UI component library.',
        tags: ['TypeScript', 'TailwindCSS'],
        link: '#',
        image: '/screenshots/screenshot-dark.png'
    },
    {
        title: 'Delta App',
        description: 'Mobile-first application for enhanced productivity.',
        tags: ['React Native', 'Firebase'],
        link: '#',
        image: '/screenshots/screenshot-light.png'
    },
];

export default function Projects() {
    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 py-8 text-zinc-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-8 ml-5">
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <a
                    href="/projects"
                    className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800/50 rounded-lg"
                    aria-label="View all projects"
                >
                    <ArrowUpRight className="w-6 h-6" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-5">
                {projects.map((project, index) => (
                    <a
                        key={index}
                        href={project.link}
                        className="block rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300 border border-zinc-700/30 hover:border-zinc-500/50 hover:-translate-y-1 group"
                    >
                        <div className="h-48 overflow-hidden rounded-t-xl">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2 text-zinc-100">{project.title}</h3>
                            <p className="text-zinc-200 text-m mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-zinc-300 font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </motion.div>
    );
}
