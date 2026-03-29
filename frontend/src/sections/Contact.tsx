import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-6 text-center text-white">
            Let's <span className="text-primary-main">Connect</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-2xl border border-white/5 glow-border"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea 
              id="message" 
              required
              rows={4}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-all resize-none"
              placeholder="Your message here..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full bg-primary-main hover:bg-primary-light text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Send Message"}
          </button>

          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg text-sm text-center">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
              Failed to send message. Please try again later.
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
