import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, ExternalLinkIcon, StarIcon } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  homepage?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham';
    fetch(`https://api.github.com/users/${username}/repos?per_page=9&sort=updated`)

      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        else console.warn("GitHub API error", data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background blobs for nice UI */}
      <div className="absolute top-1/4 left-10 w-[30vw] h-[30vw] bg-primary-dark/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[20vw] h-[20vw] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-white">
            Open Source <span className="text-primary-main">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mb-16 text-lg">
            A collection of my recent GitHub repositories. I love building tools and contributing to the open-source community.
          </p>
        </motion.div>

        {loading ? (
            <div className="w-full flex justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary-dark border-t-primary-light rounded-full animate-spin"></div>
                <p className="text-gray-400 font-mono text-sm animate-pulse">Fetching from GitHub...</p>
              </div>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((repo, i) => (
                <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative glass p-8 rounded-2xl flex flex-col justify-between h-full border border-white/5 hover:border-primary-main/50 transition-all duration-300 overflow-hidden"
                >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-main/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/5 rounded-xl text-primary-light group-hover:bg-primary-main group-hover:text-white transition-colors duration-300 shadow-lg">
                        <GithubIcon size={24} />
                      </div>
                      <div className="flex gap-3">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <StarIcon size={14} className="text-yellow-500" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        <ExternalLinkIcon size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary-light transition-colors">{repo.name}</h4>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                      {repo.description || "No description provided. Check out the repository for more details."}
                    </p>
                </div>
                
                <div className="relative z-10 flex justify-between items-center mt-auto pt-5 border-t border-white/10 group-hover:border-primary-main/30 transition-colors">
                    <div className="flex items-center gap-2">
                       {repo.language && (
                         <>
                           <span className="w-2.5 h-2.5 rounded-full bg-primary-main"></span>
                           <span className="text-xs text-gray-300 font-medium tracking-wide">{repo.language}</span>
                         </>
                       )}
                    </div>
                </div>
                </motion.a>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
