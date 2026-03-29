import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 relative overflow-hidden bg-black/60">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold font-geist mb-6 text-white tracking-tighter">SM.</h3>
        
        <div className="flex gap-6 mb-8">
          <a href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}/`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-main hover:bg-primary-main/20 transition-all">
            <GithubIcon size={20} />
          </a>
          <a href="https://www.linkedin.com/in/saksham-makhija13/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/20 transition-all">
            <LinkedinIcon size={20} />
          </a>
          <a href="mailto:smakhija140@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all">
            <MailIcon size={20} />
          </a>
        </div>
        
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Saksham Makhija. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
