import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    company: "Self",
    role: "Freelance Developer",
    period: "2023 - Present",
    description:
      "Built end-to-end websites for various clients using React,TS and handled deployment ensuring high uptime",
  },
  {
    company: "Startup Inc",
    role: "Full Stack Developer",
    period: "2021 - 2023",
    description:
      "Built and shipped multiple features for the flagship product using React and Node.js.",
  },
  {
    company: "Creative Agency",
    role: "Frontend Developer",
    period: "2019 - 2021",
    description: "Developed pixel-perfect websites for high-profile clients.",
  },
];

export default function Experience() {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8 text-zinc-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 ml-5 text-white w-fit">
        Experience
      </h1>

      <div className="space-y-6 ml-5">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-8 border-l border-zinc-700/50 hover:border-zinc-500 transition-colors"
          >
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-zinc-900 group-hover:bg-blue-500 transition-colors"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
              <h3 className="text-lg font-semibold text-zinc-100">
                {exp.role}
              </h3>
              <span className="text-sm font-mono text-white">{exp.period}</span>
            </div>
            <div className="text-md text-blue-400 mb-2">{exp.company}</div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
