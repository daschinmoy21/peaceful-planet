export default function Stack(){
  const technologies = [
    'Go', 'Rust', 'TypeScript', 'JavaScript', 'Python', 'C++',
    'ExpressJS', 'Hono', 'Chi', 'Tokio', 'PostgreSQL', 'MongoDB',
    'React', 'Next.js', 'Astro', 'TailwindCSS', 'Vite', 'Bun', 'NodeJS',
    'Docker', 'Nginx', 'Linux', 'Git', 'CI/CD',
    'FFmpeg', 'WebRTC', 'WebSockets'
  ];

  return(
  <div className="max-w-4xl mx-auto px-4 py-8 text-zinc-300">
      <h1 className="text-3xl font-bold mb-8 ml-5">What I Know</h1>

      <div className="flex flex-wrap gap-4 ml-5">
        {technologies.map((tech) => (
          <div key={tech} className="px-3 py-2 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors">
            <span className="text-sm font-medium">{tech}</span>
          </div>
        ))}
      </div>
  </div>
  );
}
