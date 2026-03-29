import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XIcon, Trash2Icon } from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string; // devicon CDN URL
  color: string; // accent color for hover glow
}

interface SkillCategory {
  category: string;
  emoji: string;
  gradient: string;
  skills: Skill[];
}

// Map categories to emojis and gradients statically
const categoryMeta: Record<string, { emoji: string, gradient: string }> = {
  "Languages": { emoji: "💻", gradient: "from-yellow-500/20 to-orange-500/20" },
  "Frontend": { emoji: "🎨", gradient: "from-cyan-500/20 to-blue-500/20" },
  "Backend": { emoji: "⚙️", gradient: "from-green-500/20 to-emerald-500/20" },
  "Databases": { emoji: "🗄️", gradient: "from-purple-500/20 to-pink-500/20" },
  "Tools & DevOps": { emoji: "🛠️", gradient: "from-orange-500/20 to-red-500/20" },
  "Soft Skills": { emoji: "🧠", gradient: "from-indigo-500/20 to-violet-500/20" },
  "Other": { emoji: "✨", gradient: "from-gray-500/20 to-blue-500/20" }
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Skill>>({ category: "Languages", color: "#61DAFB" });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/skills`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  const handleSave = async () => {
    if (!newItem.name || !newItem.category) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
           category: newItem.category,
           name: newItem.name,
           icon: newItem.icon || '',
           color: newItem.color || '#888888'
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setSkills(prev => [...prev, result]);
      }
    } catch (err) {
       console.error("Error saving skill:", err);
    }
    setShowModal(false);
    setNewItem({ category: "Languages", color: "#61DAFB" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setSkills(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  // Group skills by category
  const groupedSkills: SkillCategory[] = [];
  const groups = skills.reduce((acc, skill) => {
     if (!acc[skill.category]) acc[skill.category] = [];
     acc[skill.category].push(skill);
     return acc;
  }, {} as Record<string, Skill[]>);

  // Maintain specific order or just use the keys
  const defaultOrder = ["Languages", "Frontend", "Backend", "Databases", "Tools & DevOps", "Soft Skills", "Other"];
  for (const cat of defaultOrder) {
      if (groups[cat]) {
          groupedSkills.push({
              category: cat,
              emoji: categoryMeta[cat]?.emoji || "✨",
              gradient: categoryMeta[cat]?.gradient || categoryMeta["Other"].gradient,
              skills: groups[cat]
          });
          delete groups[cat];
      }
  }
  // Add any unexpected categories
  for (const cat in groups) {
       groupedSkills.push({
          category: cat,
          emoji: categoryMeta["Other"].emoji,
          gradient: categoryMeta["Other"].gradient,
          skills: groups[cat]
      });
  }

  return (
    <section id="skills" className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[40vw] h-[40vw] bg-primary-dark/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-purple-900/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-white">
            Technical <span className="text-primary-main">Arsenal</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-8">
            Everything I use to turn ideas into reality.
          </p>

          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-main/20 text-primary-light border border-primary-main/30 hover:bg-primary-main hover:text-white transition-all duration-300 font-bold tracking-wide"
            >
              <PlusIcon size={18} /> Add New Skill
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {groupedSkills.map((skillGroup, groupIndex) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.08, duration: 0.5 }}
              className="group relative glass p-6 md:p-7 rounded-2xl border border-white/5 hover:border-primary-main/40 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${skillGroup.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{skillGroup.emoji}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary-light transition-colors tracking-tight">
                    {skillGroup.category}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {skillGroup.skills.map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: groupIndex * 0.05 + i * 0.04, duration: 0.3 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 relative group/skill"
                      style={{ '--skill-color': skill.color } as React.CSSProperties}
                    >
                      {skill.icon ? (
                        <img src={skill.icon} alt={skill.name} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 drop-shadow-lg" loading="lazy" />
                      ) : (
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-md flex-shrink-0" style={{ background: skill.color }} />
                      )}
                      <span className="text-gray-300 text-xs md:text-sm font-medium truncate flex-grow">
                        {skill.name}
                      </span>
                      
                      {isAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(skill.id); }}
                            className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/skill:opacity-100 hover:scale-110 transition-all shadow-lg"
                            title="Delete Skill"
                          >
                            <Trash2Icon size={12} />
                          </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
                >
                    <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <XIcon size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Skill</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <select 
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" 
                                value={newItem.category} 
                                onChange={e => setNewItem({...newItem, category: e.target.value})}
                            >
                                <option value="Languages">Languages</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Databases">Databases</option>
                                <option value="Tools & DevOps">Tools & DevOps</option>
                                <option value="Soft Skills">Soft Skills</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Name</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Next.js" onChange={e => setNewItem({...newItem, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon URL (Devicon CDN)</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="https://cdn.jsdelivr.net/..." onChange={e => setNewItem({...newItem, icon: e.target.value})} />
                            <p className="text-[10px] text-gray-500 mt-1">Leave blank for no icon.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color (Hex)</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. #61DAFB" value={newItem.color} onChange={e => setNewItem({...newItem, color: e.target.value})} />
                        </div>
                        
                        <button onClick={handleSave} className="w-full py-4 bg-primary-main hover:bg-primary-dark text-white font-bold rounded-xl transition-colors mt-4">
                            Save Skill
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
