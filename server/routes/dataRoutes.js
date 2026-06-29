const express = require('express');
const { getClinics, getDoctors } = require('../controllers/dataController');

const router = express.Router();

router.get('/clinics', getClinics);
router.get('/doctors', getDoctors);

module.exports = router;
