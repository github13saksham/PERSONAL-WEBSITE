import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AwardIcon, ExternalLinkIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';

export interface CertificateItem {
  id: string;
  date: string;
  title: string;
  issuer: string;
  description: string;
  link?: string;
}

const defaultCertificates: CertificateItem[] = [];

const Certificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<CertificateItem>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch('http://localhost:5000/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCertificates(data);
        } else {
          setCertificates(defaultCertificates);
        }
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setCertificates(defaultCertificates);
      });
  }, []);

  const handleSave = async () => {
    if (!newItem.title || !newItem.issuer || !newItem.date) return;
    
    const finalItem: CertificateItem = {
      id: "cert-" + Date.now(),
      title: newItem.title,
      issuer: newItem.issuer,
      date: newItem.date,
      description: newItem.description || '',
      link: newItem.link || ''
    };
    setCertificates(prev => [...prev, finalItem]);

    try {
      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(finalItem),
      });
      if (response.ok) {
        const result = await response.json();
        setCertificates(prev => prev.map(item => item.id === finalItem.id ? result : item));
      }
    } catch (err) {
       console.error("Error saving certificate to DB:", err);
    }

    setShowModal(false);
    setNewItem({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setCertificates(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`http://localhost:5000/api/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting certificate:', err);
    }
  };

  return (
    <section id="certificates" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 relative"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-white">
            Licenses & <span className="text-purple-500">Certifications</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            A showcase of my verified skills and official credentials.
          </p>
          
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold tracking-wide"
            >
              <PlusIcon size={18} /> Add New Certificate
            </button>
          )}
        </motion.div>

        {certificates.length === 0 ? (
            <div className="text-center text-gray-500 italic py-12 border border-white/5 rounded-2xl glass">
                No certificates added yet. Click the button above to add one!
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="glass p-6 md:p-8 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group shadow-2xl flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      <AwardIcon size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2.5 py-1 md:px-3 md:py-1 bg-white/5 text-gray-400 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full border border-white/10">
                        {item.date}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2Icon size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <h4 className="text-sm md:text-base text-gray-400 font-medium mb-3 md:mb-4">{item.issuer}</h4>
                  
                  <p className="text-gray-300 leading-relaxed text-sm flex-grow mb-6">
                    {item.description}
                  </p>
                  
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-purple-400 mt-auto transition-colors w-max"
                    >
                      View Credential <ExternalLinkIcon size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Certificate</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. AWS Certified Developer" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Issuer</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Amazon Web Services" onChange={e => setNewItem({...newItem, issuer: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Aug 2024" onChange={e => setNewItem({...newItem, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 h-24" placeholder="Brief details about the certificate..." onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Credential Link (Optional)</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" placeholder="https://..." onChange={e => setNewItem({...newItem, link: e.target.value})} />
                        </div>
                        <button onClick={handleSave} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors mt-4">
                            Save Certificate
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
