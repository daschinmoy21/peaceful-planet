import React from "react";
import { ArrowUpRight, Github, ExternalLink, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Russel",
    description: "A local cloud-native orchestrator combining VM isolation with container speed. Spawns ephemeral microVMs in milliseconds via Cloud Hypervisor. Features QCOW2 support, I/O hotplugging, zero-copy Nix integration, Rust/Go architecture, and automatic public ingress.",
    tags: ["Rust", "Go", "Cloud Hypervisor", "KVM", "Nix", "In Progress"],
    image: "/wip.jpg",
  },
  {
    title: "Logia",
    description:
      "A modern notes app that transcribes lectures,in-built canvas and AI features.Available for Windows,Linux and MacOS.",
    tags: ["React", "Rust", "Python", "TS", "C#"],
    demo: "https://www.getlogia.online",
    github: "https://www.github.com/daschinmoy21/logia",
    image: "/logia.webp",
  },
  {
    title: "Lightspeed",
    description:
      "P2P file sharing utilizing TCP and QUIC for maximum throughput. Engineered to outperform existing solutions like LocalSend and QuickShare in local transfer benchmarks. (Benchmarks coming soon)",
    tags: ["Rust", "Linux"],
    github: "https://github.com/daschinmoy21/lightspeed",
    image: "/lightspeed.png",
  },
  {
    title: "LMS Discord Bot",
    description:
      "This Discord bot automatically notifies users about updates on their college LMS,specifically focusing on assignments, labs, quizzes, and other important events while filtering out attendance-related notifications.",
    tags: ["Typescript", "Python", "Discord.js", "Node.js"],
    github: "https://github.com/daschinmoy21/LmsBot",
    image: "/discord2.png",
  },
  {
    title: "Trello Clone",
    description:
      "A Trello-like application with role based access,user authentication, shared workspaces, Kanban boards, real-time updates, and board chat functionality.",
    tags: ["PostgreSQL", "FastAPI", "React", "Socket.IO", "Docker"],
    github: "https://github.com/daschinmoy21/trello",
    image: "/trello2.png",
  },
];


interface ProjectsProps {
  limit?: number;
}

export default function Projects({ limit }: ProjectsProps) {
  const visibleProjects = limit ? projects.slice(0, limit) : projects;

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
        {!limit && (
          <a
            href="/projects"
            className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800/50 rounded-lg"
            aria-label="View all projects"
          >
            <ArrowUpRight className="w-6 h-6" />
          </a>
        )}
      </div>

      <div className="flex flex-col gap-6 ml-5">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:bg-zinc-900/50 rounded-sm"
          >
            {/* Image Section - Spans 5 cols */}
            <div className="md:col-span-5 relative overflow-hidden h-48 md:h-full min-h-[12rem] border border-zinc-800 rounded-sm">
              <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Content Section - Spans 7 cols */}
            <div className="md:col-span-7 flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors font-mono">
                    {project.title}
                  </h3>
                  <div className="flex gap-3">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors rounded-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors rounded-sm"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-6 font-mono text-sm">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 text-xs font-medium border rounded-sm font-mono ${tag === "In Progress"
                      ? "text-yellow-400 bg-yellow-900/20 border-yellow-700/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                      : "text-zinc-400 bg-zinc-900 border-zinc-800"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {limit && (
        <div className="flex justify-center mt-12 ml-5">
          <a
            href="/projects"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all rounded-sm font-mono"
          >
            Show All Projects
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
