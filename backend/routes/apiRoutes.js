const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { fetchProjects } = require('../controllers/githubController');
const { getExperiences, addExperience, getCertificates, addCertificate } = require('../controllers/profileController');

router.post('/contact', submitContact);
router.get('/github-projects', fetchProjects);

router.get('/experience', getExperiences);
router.post('/experience', addExperience);

router.get('/certificates', getCertificates);
router.post('/certificates', addCertificate);

module.exports = router;
