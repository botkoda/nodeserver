const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const baseQuery = 
 ` select id "id",name"name",color "color" from cars where 1=1 `;
 // *** lines that initalize baseQuery end here ***
 
const sortableColumns = ['id', 'name', 'color'];

async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.cars_id = context.id;
     query += `\nand id = :cars_id `;  
  }
  
  if (context.name) {
    binds.name = '%'+context.name+'%';
    query += `\nand lower(name) like :name  `;
  }
 
  if (context.color) {
    binds.color = '%'+context.color+'%';
    query += '\nand lower(color) like :color ';
  }
   // *** if block that appends where clause ends here ***
 
   if (context.sort === undefined) {
    query += '\norder by name asc ';
  } else {
    let [column, order] = context.sort.split(':');
 
    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }
 
    if (order === undefined) {
      order = 'asc';
    }
 
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Invalid "sort" order');
    }
 
    query += `\norder by "${column}" ${order} `;
  }
 
  if (context.skip) {
    binds.row_offset = context.skip;
 
    query += '\noffset :row_offset rows ';
  }
 
  const limit = (context.limit > 0) ? context.limit : 30;
 
  binds.row_limit = limit;
 
  query += '\nfetch next :row_limit rows only ';
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