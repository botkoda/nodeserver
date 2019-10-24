const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const baseQuery = 
 ` select id "id",name"name",color "color" from cars `;
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.cars_id = context.id;
 
    query += `\nwhere id = :cars_id`;
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;

const createSql =
 `insert into cars (
    id,
    name,
    color
  ) values (
    :id,
    :name,
    :color
  ) returning id
  into :id`;
 
async function create(emp) {
  const car = Object.assign({}, emp);
 
 /* car.id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }*/
 
  const result = await database.simpleExecute(createSql, car);
 
 /* car.id = result.outBinds.id[0];*/
 
  return car;
}
 
module.exports.create = create;

const updateSql =
 `update cars
  set id = :id,
    name = :name,
    color = :color 
  where id = :id`;
 
async function update(emp) {
  const car = Object.assign({}, emp);
  const result = await database.simpleExecute(updateSql, car);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return car;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin
 
    delete from cars
    where id = :id;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(id) {
  const binds = {
    id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);
 
  return result.outBinds.rowcount === 1;
}
 
module.exports.delete = del;