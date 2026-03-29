import { motion } from 'framer-motion';

const skillsData = [
  {
    category: "Languages",
    items: ["Python", "C", "JavaScript", "SQL", "PHP"]
  },
  {
    category: "Frontend",
    items: ["React.js", "TailwindCSS", "CSS", "Responsive Design"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"]
  },
  {
    category: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL"]
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code"]
  },
  {
    category: "Soft Skills",
    items: ["Problem Solving", "Analytical Thinking", "Team Collaboration", "Communication"]
  }
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-black/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-geist mb-4 text-center text-white">
            Technical <span className="text-primary-main">Arsenal</span>
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
            Everything I use to turn ideas into reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-primary-main/30 transition-all group"
            >
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary-light transition-colors">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map(item => (
                  <span key={item} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full border border-white/5 group-hover:border-primary-main/20">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
