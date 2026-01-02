import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="max-w-4xl mx-auto pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner Area */}
      <div
        className="relative mt-5 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-48 w-full bg-neutral-800 rounded-t-2xl overflow-hidden relative">
          <img
            src="/wide-dither.webp"
            alt="Wanderer over the sea of Fog"
            className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${
              isHovered
                ? "brightness-100 scale-105"
                : "brightness-[0.6] scale-100"
            }`}
          />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl shadow-2xl max-w-sm w-[90%] z-50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-2 mb-2">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold text-white tracking-wide"
                  >
                    Venture Into the Unknown
                  </motion.h3>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-mono text-zinc-400"
                  >
                    /wan·der·er/
                  </motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-zinc-300 leading-relaxed"
                >
                  Wanderer Above The Sea Of Fog by Caspar David Friedrich
                </motion.p>
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 border-l border-t border-white/10 transform rotate-45 backdrop-blur-md"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 pb-8 bg-zinc-900/40 rounded-b-2xl border border-zinc-800 border-t-0 -mt-1 backdrop-blur-md">
        <div className="flex flex-col">
          {/* Profile Picture */}
          <div className="-mt-16 mb-4 relative z-10">
            <img
              src="/pfp.webp"
              alt="Profile Picture"
              className="w-32 h-32 rounded-full border-4 border-zinc-950 object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-4xl font-bold text-white">Chinmoy</h1>
                <svg
                  viewBox="0 0 24 24"
                  aria-label="Verified Account"
                  className="w-6 h-6 text-blue-500 fill-current"
                >
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.416-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.58.875 2.95 2.147 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 4 3.818 4 .47 0 .92-.084 1.336-.25.62 1.333 1.926 2.25 3.437 2.25s2.817-.917 3.437-2.25c.416.165.866.25 1.336.25 2.11 0 3.818-1.79 3.818-4 0-.495-.084-.965-.238-1.4 1.272-.65 2.147-2.02 2.147-3.6z" />
                  <path
                    fill="#fff"
                    d="M10 17l-5-5 1.41-1.42L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl text-zinc-300">Software Engineer</h3>
            </div>

            {/* Social Media Buttons */}
            <div className="flex gap-4">
              <a
                href="https://github.com/daschinmoy21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                title="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </a>

              <a
                href="https://x.com/crimxnhaze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
              </a>

              <a
                href="mailto:your.email@example.com"
                className="flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Email"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              </a>

              <a
                href="https://discord.gg/yourinvite"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
              </a>
            </div>

            <div className="text-lg text-zinc-300 max-w-2xl">
              Hey there! I'm Chinmoy, a developer building efficient tools and
              learning new technologies. I specialize in full-stack development
              using Go, Rust, and TypeScript.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
