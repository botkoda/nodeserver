const express = require('express');
const router = new express.Router();
const cars = require('../controllers/cars.js');
 
router.route('/cars/:id?')
  .get(cars.get)
  .post(cars.post)
  .put(cars.put)
  .delete(cars.delete);
module.exports = router;