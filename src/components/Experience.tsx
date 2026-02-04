import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    company: "Contract Developer",
    role: "Freelance",
    period: "2025 - Present",
    description: [
      "Built end-to-end websites for various clients using Astro, React, TS and handled deployment ensuring high uptime under traffic",
      "Designed and deployed a production website used by large user base",
      "Implemented backend APIs for registration, contact, content management",
    ],
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
            className="relative pl-8 border-l border-zinc-700/50 hover:border-zinc-500 transition-colors group"
          >
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-zinc-900 group-hover:bg-blue-500 transition-colors"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
              <h3 className="text-lg font-semibold text-zinc-100">
                {exp.role}
              </h3>
              <span className="text-sm font-mono text-white">{exp.period}</span>
            </div>
            <div className="text-md text-blue-400 mb-2">{exp.company}</div>
            <ul className="list-disc list-outside ml-4 space-y-1">
              {exp.description.map((item, i) => (
                <li key={i} className="text-zinc-400 text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
