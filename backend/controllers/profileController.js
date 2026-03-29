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
