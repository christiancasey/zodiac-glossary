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

const addTodoListItem = (request, response) => {

  console.log('addTodoListItem, content', request.body.newItem, 'by', request.decoded.username);

  const sql = `INSERT INTO todo (item, added_by)
    VALUES ($1, (SELECT id FROM users WHERE username = $2));`;
  const values = [ request.body.newItem, request.decoded.username ];

  pool.query(sql, values, (error, result) => {
    if (error){
      console.log(error);
      response.status(500);
      return;
    }

    // Return the new todo list to update view simply
    getTodoList(request, response);
  });

};

module.exports = {
  getTodoList,
  addTodoListItem,
}