export default function Navbar() {
  return (
    <div className="text-white navbar justify-between bg-zinc-950/30 shadow-sm max-w-4xl mx-auto fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        {/* <a className="btn btn-ghost text-xl">crimxn</a> */}
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          <li><a>Blog</a></li>
          <li><a>Projects</a></li>
          <li><a>Resume</a></li>
        </ul>
      </div>
    </div>
  );
}
