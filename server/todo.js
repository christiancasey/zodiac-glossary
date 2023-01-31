const pool = require('./pool');

const getTodoList = (request, response) => {
  const sql = `SELECT * FROM todo ORDER BY complete, date_added DESC;`;
  pool.query(sql, (error, { rows: todoList }) => {
    if (error){
      console.log(error);
      response.status(500);
      return;
    }
    response.status(200).json(todoList);
  });
};

module.exports = {
  getTodoList,
}