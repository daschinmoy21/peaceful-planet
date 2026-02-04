import { motion } from "framer-motion";

export default function Stack() {
  const technologies = [
    { name: 'Go', slug: 'go', color: '00ADD8' },
    { name: 'Rust', slug: 'rust', color: 'FFFFFF' },
    { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
    { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
    { name: 'Python', slug: 'python', color: '3776AB' },
    { name: 'C++', slug: 'cplusplus', color: '00599C' },
    { name: 'Express', slug: 'express', color: 'FFFFFF' },
    { name: 'Hono', slug: 'hono', color: 'E36002' },
    { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
    { name: 'MongoDB', slug: 'mongodb', color: '47A248' },
    { name: 'React', slug: 'react', color: '61DAFB' },
    { name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF' },
    { name: 'Astro', slug: 'astro', color: 'BC52EE' },
    { name: 'Tailwind', slug: 'tailwindcss', color: '06B6D4' },
    { name: 'Vite', slug: 'vite', color: '646CFF' },
    { name: 'Bun', slug: 'bun', color: 'FFFFFF' },
    { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
    { name: 'Docker', slug: 'docker', color: '2496ED' },
    { name: 'Nginx', slug: 'nginx', color: '009639' },
    { name: 'Linux', slug: 'linux', color: 'FCC624' },
    { name: 'Git', slug: 'git', color: 'F05032' },
    { name: 'FFmpeg', slug: 'ffmpeg', color: '007808' },
    { name: 'WebRTC', slug: 'webrtc', color: 'FFFFFF' },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8 text-zinc-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 ml-5 text-white">Tools I Use</h1>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 ml-5">
        {technologies.map((tech) => (
          <div key={tech.name} className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/80 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ring-1 ring-white/5 hover:ring-white/20">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                alt={tech.name}
                className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity filter group-hover:brightness-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xs font-bold text-center">{tech.name[0]}</span>
            </div>
            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 bg-black/90 px-2 py-1 rounded text-white whitespace-nowrap z-10 pointer-events-none">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
