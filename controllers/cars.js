const cars = require('../db_apis/cars.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await cars.find(context);
 
    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;

function getCarsFromRec(req) {
    const car = {
      id: req.body.id,
      name: req.body.name,
      color: req.body.color
    };
   
    return car;
  }
   
  async function post(req, res, next) {
    try {
      let car = getCarsFromRec(req);
   
      car = await cars.create(car);
   
      res.status(201).json(car);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;

  async function put(req, res, next) {
    try {
      let car = getCarsFromRec(req);
   
      car.id = parseInt(req.params.id, 3);
   
      car = await cars.update(car);
   
      if (car !== null) {
        res.status(200).json(car);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.put = put;

  async function del(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
   
      const success = await cars.delete(id);
   
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.delete = del;