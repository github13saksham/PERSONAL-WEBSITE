const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getExperiences = async (req, res) => {
  try {
    const data = await prisma.experience.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const { type, title, subtitle, date, description } = req.body;
    const item = await prisma.experience.create({
      data: { type, title, subtitle, date, description }
    });
    res.json(item);
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const data = await prisma.certificate.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

exports.addCertificate = async (req, res) => {
  try {
    const { title, issuer, date, description, link } = req.body;
    const item = await prisma.certificate.create({
      data: { title, issuer, date, description, link }
    });
    res.json(item);
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    await prisma.certificate.delete({ where: { id: req.params.id } });
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const data = await prisma.skill.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { category, name, icon, color } = req.body;
    const item = await prisma.skill.create({
      data: { category, name, icon, color }
    });
    res.json(item);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const data = await prisma.project.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { name, description, html_url, language, stargazers_count, forks_count } = req.body;
    const item = await prisma.project.create({
      data: { 
        name, 
        description, 
        html_url, 
        language, 
        stargazers_count: parseInt(stargazers_count) || 0,
        forks_count: parseInt(forks_count) || 0
      }
    });
    res.json(item);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
