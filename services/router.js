const express = require('express');
const router = new express.Router();
const employees = require('../controllers/cars.js');
 
router.route('/cars/:id?')
  .get(employees.get);
 
module.exports = router;