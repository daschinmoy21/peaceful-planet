import { motion } from "framer-motion";

export default function Skills() {
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
        { name: 'Nix', slug: 'nixos', color: '5277C3' },
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
            <h1 className="text-3xl font-bold mb-8 ml-5 text-white">Skills</h1>

            <div className="flex flex-wrap gap-4 ml-5">
                {technologies.map((tech) => (
                    <div
                        key={tech.name}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/80 transition-all duration-300 cursor-default hover:shadow-lg hover:shadow-zinc-900/20"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <img
                                src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                                alt={tech.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
