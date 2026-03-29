import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseIcon, GraduationCapIcon, PlusIcon, XIcon } from 'lucide-react';

export type ExperienceType = 'job' | 'education';

export interface TimelineItem {
  id: string;
  type: ExperienceType;
  date: string;
  title: string;
  subtitle: string;
  description: string;
}

const defaultTimelineData: TimelineItem[] = [
  {
    id: "job-1",
    type: "job",
    date: "May 2025 – July 2025",
    title: "Frontend Developer Intern",
    subtitle: "Primus Partners Solution Pvt Ltd",
    description: "Worked on the Parivar Pehchan Patra Government portal. Developed secure login systems and scalable family dashboards utilizing React, TailwindCSS, and optimized API integrations. Contributed to improving web vitals and overall UI smoothness."
  },
  {
    id: "edu-1",
    type: "education",
    date: "2023 - Present",
    title: "B.Tech - Computer Science",
    subtitle: "University Institute / College",
    description: "Focusing on full-stack development, AI, and scalable backend architectures. I've been active in programming clubs, open-source organization contributions, and collaborative academic research logic."
  }
];

const Experience = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<TimelineItem>>({ type: 'job' });

  useEffect(() => {
    fetch('http://localhost:5000/api/experience')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTimelineData(data);
        } else {
          setTimelineData(defaultTimelineData);
        }
      })
      .catch(err => {
        console.error('Error fetching experiences:', err);
        setTimelineData(defaultTimelineData);
      });
  }, []);

  const handleSave = async () => {
    if (!newItem.title || !newItem.subtitle || !newItem.date) return;
    
    // Optimistic offline update
    const finalItem: TimelineItem = {
      id: "exp-" + Date.now(),
      type: newItem.type || 'job',
      title: newItem.title,
      subtitle: newItem.subtitle,
      date: newItem.date,
      description: newItem.description || ''
    };
    setTimelineData(prev => [...prev, finalItem]);

    try {
      const response = await fetch('http://localhost:5000/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalItem),
      });
      if (response.ok) {
        const result = await response.json();
        // Replace optimistic item with true DB item
        setTimelineData(prev => prev.map(item => item.id === finalItem.id ? result : item));
      }
    } catch (err) {
      console.error('Error saving experience to database:', err);
    }

    setShowModal(false);
    setNewItem({ type: 'job' }); // reset
  };

  return (
    <section id="experience" className="py-24 bg-black/40 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-primary-dark/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 relative"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-white">
            My <span className="text-primary-main">Journey</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            A timeline of my professional setup ranging from backend systems to frontline internships.
          </p>
          
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-main/20 text-primary-light border border-primary-main/30 hover:bg-primary-main hover:text-white transition-all duration-300 font-bold tracking-wide"
          >
            <PlusIcon size={18} /> Add New Experience
          </button>
        </motion.div>

        <div className="relative pl-8 md:pl-0">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-main via-blue-500 to-transparent transform md:-translate-x-1/2"></div>
          
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            
            // Dynamic styling based on the type of timeline item
            let Icon = BriefcaseIcon;
            let iconColorClasses = "border-primary-light group-hover:bg-primary-main shadow-primary-main/30";
            let glowClasses = "bg-primary-main/10 group-hover:bg-primary-main/30";
            let titleHoverClass = "group-hover:text-primary-light";
            let borderClasses = "border-primary-main/20 hover:border-primary-main/80";

            if (item.type === 'education') {
               Icon = GraduationCapIcon;
               iconColorClasses = "border-blue-500 group-hover:bg-blue-600 shadow-blue-500/30";
               glowClasses = "bg-blue-500/10 group-hover:bg-blue-500/30";
               titleHoverClass = "group-hover:text-blue-400";
               borderClasses = "border-white/5 hover:border-blue-500/50";
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`relative mb-16 md:w-1/2 cursor-pointer group ${isLeft ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}
              >
                {/* Timeline icon node */}
                <div className={`absolute left-0 w-[40px] h-[40px] top-1 bg-[#151515] border-2 transition-colors duration-500 rounded-full flex justify-center items-center transform -translate-x-[20px] z-10 shadow-lg ${isLeft ? 'md:left-auto md:-right-[20px] md:translate-x-0' : ''} ${iconColorClasses}`}>
                    <Icon size={18} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                
                <div className={`glass p-8 rounded-2xl border hover:bg-white/5 transition-all duration-300 ml-4 md:ml-0 relative overflow-hidden shadow-2xl ${borderClasses}`}>
                  <div className={`absolute top-0 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${isLeft ? 'right-0' : 'left-0'} ${glowClasses}`} />
                  <div className="relative z-10">
                      <span className={`inline-block px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-full border border-white/10 mb-3 block w-max ${isLeft ? 'md:ml-auto' : ''}`}>
                        {item.date}
                      </span>
                      <h3 className={`text-2xl font-bold text-white mb-1 transition-colors ${titleHoverClass}`}>
                        {item.title}
                      </h3>
                      <h4 className="text-gray-400 font-medium mb-4 tracking-wide">{item.subtitle}</h4>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {item.description}
                      </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
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
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Journey Item</h3>
                    
                    <div className="space-y-4 text-left">
                        <div className="flex gap-4 mb-2">
                           <button onClick={() => setNewItem({...newItem, type: 'job'})} className={`flex-1 py-2 rounded-xl border text-sm font-bold ${newItem.type === 'job' ? 'border-primary-main bg-primary-main/20 text-primary-light' : 'border-white/10 text-gray-400'}`}>Job Experience</button>
                           <button onClick={() => setNewItem({...newItem, type: 'education'})} className={`flex-1 py-2 rounded-xl border text-sm font-bold ${newItem.type === 'education' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 text-gray-400'}`}>Education</button>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Senior Backend Engineer" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company / Institution</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Google" onChange={e => setNewItem({...newItem, subtitle: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Jan 2024 - Present" onChange={e => setNewItem({...newItem, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main h-24" placeholder="Brief details about the role..." onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                        </div>
                        <button onClick={handleSave} className="w-full py-4 bg-primary-main hover:bg-primary-dark text-white font-bold rounded-xl transition-colors mt-4">
                            Save Item
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;
