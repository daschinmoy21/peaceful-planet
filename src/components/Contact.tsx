import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  const socials = [
    {
      name: "GitHub",
      icon: faGithub,
      link: "https://github.com/daschinmoy21",
      color: "hover:text-white",
    },
    {
      name: "Twitter",
      icon: faTwitter,
      link: "https://x.com/crimxnhaze",
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Email",
      icon: faEnvelope,
      link: "mailto:daschinmoyy21@gmail.com",
      color: "hover:text-emerald-400",
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-12 text-zinc-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 ml-5 text-white w-fit">Contact</h1>

      <div className="ml-5 flex flex-col items-start gap-4">
        <p className="text-zinc-400 max-w-lg mb-4">
          I'm currently open to new opportunities. Whether you have a question
          or just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="flex gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl text-zinc-500 transition-colors duration-300 ${social.color}`}
              aria-label={social.name}
            >
              <FontAwesomeIcon icon={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
