import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-6 text-white">
            About <span className="text-primary-main">Me</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Motivated Full Stack Developer skilled in crafting dynamic user interfaces with React and TailwindCSS and building scalable APIs using Node.js, Express, and MongoDB. I strive to merge beautiful design with robust engineering.
          </p>
          
          <div className="glass p-8 rounded-2xl border border-white/5 glow-border relative overflow-hidden">
           <div className="absolute top-0 left-0 w-2 h-full bg-primary-main"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Experience Highlights</h3>
            <div className="mt-4">
              <h4 className="text-xl font-semibold text-primary-light">Frontend Developer Intern</h4>
              <p className="text-gray-400 font-medium my-1">Primus Partners Solution Pvt Ltd</p>
              <p className="text-sm text-gray-500 mb-4">May 2025 – July 2025</p>
              <p className="text-gray-300">
                Worked on the Parivar Pehchan Patra Government portal developing login systems and family dashboards with React, TailwindCSS and API integrations. Optimized component rendering sequences resulting in more fluid navigation experiences.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
