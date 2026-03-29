const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { fetchProjects } = require('../controllers/githubController');
const { 
  getExperiences, addExperience, deleteExperience, 
  getCertificates, addCertificate, deleteCertificate,
  getSkills, addSkill, deleteSkill,
  getProjects, addProject, deleteProject
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController');

router.post('/login', login);

router.post('/contact', submitContact);
router.get('/github-projects', fetchProjects); // Original Github fetch

router.get('/experience', getExperiences);
router.post('/experience', authMiddleware, addExperience);
router.delete('/experience/:id', authMiddleware, deleteExperience);

router.get('/certificates', getCertificates);
router.post('/certificates', authMiddleware, addCertificate);
router.delete('/certificates/:id', authMiddleware, deleteCertificate);

router.get('/skills', getSkills);
router.post('/skills', authMiddleware, addSkill);
router.delete('/skills/:id', authMiddleware, deleteSkill);

router.get('/projects', getProjects);
router.post('/projects', authMiddleware, addProject);
router.delete('/projects/:id', authMiddleware, deleteProject);

module.exports = router;
