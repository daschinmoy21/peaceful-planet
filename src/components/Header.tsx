import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Header(){
  return(
  <div className="max-w-4xl mx-auto px-4 py-5">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <img
          src="/pfp.webp"
          alt="Profile Picture"
          className="w-32 h-32 rounded-4xl object-cover"
          />
        </div>

        <div className="flex-1">
        <h1 className="text-4xl font-bold text-white mb-2 ml-4">
        Chinmoy
        </h1>
        <h3 className="text-xl text-zinc-300 mb-4 ml-5">
        Software Engineer
        </h3>

        {/* Social Media Buttons */}
        <div className="flex gap-4 ml-5">
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
        </div>
  </div>
  </div>
  );
}
