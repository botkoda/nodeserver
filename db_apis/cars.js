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