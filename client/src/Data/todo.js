export function getTodoList(setTodoList) {
  let url = '/api/todo/list';

  fetch(url, {
    method: "GET",
  })
  .then(res => res.json())
  .then(data => setTodoList(data))
  .catch(data => console.log(data));
}