import { Home, Download } from "lucide-react";

export default function Navbar() {
  return (
    <div className="text-white navbar justify-between bg-zinc-950/30 shadow-sm max-w-4xl mx-auto fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">
              <Home size={22} />
            </a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/projects">Projects</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
