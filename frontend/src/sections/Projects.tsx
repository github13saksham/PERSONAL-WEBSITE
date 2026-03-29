import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon, ExternalLinkIcon, StarIcon, GitForkIcon, CodeIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';
import { API_BASE } from '../config';

interface Repo {
  id: string; // Database uuid
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

// Language color mapping
const langColors: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Java: '#ED8B00',
  'C++': '#00599C',
  C: '#A8B9CC',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  Dart: '#0175C2',
  Shell: '#89E051',
  Jupyter: '#F37626',
};

const Projects = () => {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  
  // Admin controls
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Repo>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn("API error", data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!newItem.name || !newItem.html_url) return;
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
           name: newItem.name,
           description: newItem.description || "No description provided.",
           html_url: newItem.html_url,
           language: newItem.language || "Other",
           stargazers_count: newItem.stargazers_count || 0,
           forks_count: newItem.forks_count || 0
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setProjects(prev => [...prev, result]);
      }
    } catch (err) {
       console.error("Error saving project:", err);
    }
    setShowModal(false);
    setNewItem({});
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // Get unique languages for filter tabs
  const languages = ['All', ...Array.from(new Set(projects.map(p => p.language).filter(Boolean)))];
  
  const filteredProjects = filter === 'All' 
    ? projects.slice(0, 9) 
    : projects.filter(p => p.language === filter).slice(0, 9);

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-10 w-[30vw] h-[30vw] bg-primary-dark/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[20vw] h-[20vw] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-[25vw] h-[25vw] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-white">
            Open Source <span className="text-primary-main">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg mb-8">
            A curated collection of my top project repositories.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Language filter tabs */}
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                    filter === lang 
                      ? 'bg-primary-main/20 border-primary-main/50 text-primary-light' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang !== 'All' && (
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: langColors[lang] || '#888' }}
                    />
                  )}
                  {lang}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button 
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-main/20 text-primary-light border border-primary-main/30 hover:bg-primary-main hover:text-white transition-all duration-300 font-bold tracking-wide text-sm"
              >
                <PlusIcon size={16} /> Add project
              </button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="w-full flex justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-dark border-t-primary-light rounded-full animate-spin" />
              <p className="text-gray-400 font-mono text-sm animate-pulse">Loading projects...</p>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            layout
          >
            {filteredProjects.map((repo, i) => (
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                key={repo.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -8 }}
                layout
                className="group relative flex flex-col h-full rounded-2xl border border-white/[0.06] hover:border-primary-main/50 transition-all duration-500 overflow-hidden bg-[#0d0d0d]/80 backdrop-blur-sm"
              >
                {/* Top colored accent bar */}
                <div 
                  className="h-1 w-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, ${langColors[repo.language] || '#6366f1'}, transparent)` }}
                />

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="p-2.5 bg-white/[0.04] rounded-xl text-primary-light group-hover:bg-primary-main/20 transition-colors duration-300">
                      <CodeIcon size={22} className="group-hover:text-primary-light" />
                    </div>
                    <div className="flex items-center gap-3">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-yellow-500 transition-colors">
                          <StarIcon size={13} className="text-yellow-500/70" />
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <GitForkIcon size={13} />
                          {repo.forks_count}
                        </span>
                      )}
                      {isAdmin ? (
                        <button
                          onClick={(e) => handleDelete(e, repo.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                          title="Delete Project"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      ) : (
                        <ExternalLinkIcon size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  {/* Repo name */}
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors tracking-tight">
                    {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {repo.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/[0.06] group-hover:border-primary-main/20 transition-colors mt-auto">
                    <div className="flex items-center gap-2">
                      {repo.language && (
                        <>
                          <span 
                            className="w-3 h-3 rounded-full shadow-md"
                            style={{ backgroundColor: langColors[repo.language] || '#888' }}
                          />
                          <span className="text-xs text-gray-400 font-medium">{repo.language}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 group-hover:text-gray-300 transition-colors">
                      <GithubIcon size={14} />
                      <span className="hidden md:inline">View Repo</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* View all on GitHub */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <a 
            href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-primary-main/30 transition-all duration-300 font-medium text-sm"
          >
            <GithubIcon size={20} className="group-hover:rotate-[360deg] transition-transform duration-700" />
            View All Repositories
            <ExternalLinkIcon size={14} className="opacity-50 group-hover:opacity-100" />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
                >
                    <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <XIcon size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Project</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Name</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" onChange={e => setNewItem({...newItem, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GitHub URL</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="https://github.com/..." onChange={e => setNewItem({...newItem, html_url: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Language</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. TypeScript" onChange={e => setNewItem({...newItem, language: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Stars</label>
                                <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="0" onChange={e => setNewItem({...newItem, stargazers_count: parseInt(e.target.value) || 0})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main h-24" onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                        </div>
                        
                        <button onClick={handleSave} className="w-full py-4 bg-primary-main hover:bg-primary-dark text-white font-bold rounded-xl transition-colors mt-4">
                            Save Project
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Projects;
