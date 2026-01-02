import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BadgeCheck } from "lucide-react";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="h-48 w-full bg-neutral-800 rounded-sm overflow-hidden relative border border-zinc-800">
          <img
            src="/wanderer-init.png"
            alt="Wanderer over the sea of Fog"
            className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${isHovered
              ? "brightness-100 scale-[1.005]"
              : "brightness-[0.6] scale-100"
              }`}
          />
          <img
            src="/wide-dither.webp"
            alt="Wanderer over the sea of Fog (Hover)"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${isHovered ? "opacity-100 scale-[1.2]" : "opacity-0 scale-100"
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
              className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/90 backdrop-blur-md border border-zinc-700/50 px-6 py-4 rounded-sm shadow-2xl max-w-sm w-[90%] z-50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between border-b border-zinc-800 pb-2 mb-2">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold text-white tracking-wide font-mono"
                  >
                    Venture Into the Unknown
                  </motion.h3>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-mono text-zinc-500"
                  >
                    /wan·der·er/
                  </motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-zinc-400 leading-relaxed font-mono"
                >
                  Wanderer Above The Sea Of Fog by Caspar David Friedrich
                </motion.p>
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border-l border-t border-zinc-700/50 transform rotate-45 backdrop-blur-md"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 pb-8 mt-4 bg-zinc-900/40 border border-zinc-800 border-t-0 -mt-1 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
          {/* Profile Picture */}
          <div className="-mt-16 relative z-10 shrink-0">
            <img
              src="/pfp2.jpg"
              alt="Profile Picture"
              className="w-32 h-32 rounded-full brightness-[0.8] border-4 border-zinc-950 object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-2 pb-2 w-full">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-white tracking-tight font-mono">
                  Chinmoy
                </h1>
                <BadgeCheck className="w-8 h-8 text-blue-500" fill="currentColor" stroke="black" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl text-zinc-400 font-mono">
                Software Developer
              </h3>
            </div>

            {/* Social Media Buttons */}
            <div className="flex gap-4 mt-1">
              <a
                href="https://github.com/daschinmoy21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                title="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
              </a>

              <a
                href="https://x.com/crimxnhaze"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/80 hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
              </a>

              <a
                href="mailto:daschinmoyy21@gmail.com"
                className="text-red-500/80 hover:text-red-500 transition-colors"
                title="Email"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6" />
              </a>

            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mt-10">
          <div className="text-lg text-zinc-400 max-w-2xl font-mono leading-relaxed">
            Hey there! I'm Chinmoy, a developer building efficient tools and
            learning new technologies. I specialize in full-stack development
            using Go, Rust, and TypeScript.
          </div>

          <div className="flex flex-col items-end gap-1 text-sm text-zinc-500 font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span>
                {time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Assam, India</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
