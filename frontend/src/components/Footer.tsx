import { useState, useEffect } from 'react';
import { GithubIcon, LinkedinIcon, MailIcon, ClockIcon } from 'lucide-react';

const Footer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="border-t border-white/5 py-12 relative overflow-hidden bg-black/60">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold font-geist mb-6 text-white tracking-tighter">SM.</h3>
        
        <div className="flex gap-6 mb-6">
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

        <div className="flex items-center gap-2 mb-8 text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm">
          <ClockIcon size={16} className="text-primary-main" />
          <span className="font-mono tracking-wider">{time.toLocaleTimeString()}</span>
        </div>
        
        <p className="text-gray-500 text-sm">
          © {time.getFullYear()} Saksham Makhija. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
