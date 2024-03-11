export function getTodoList(setTodoList, user = {}) {
  let url = '/api/todo/list';
  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.token,
    },
    method: "GET",
  })
  .then(res => res.json())
  .then(data => setTodoList(data))
  .catch(data => console.log(data));
}

export function addTodoListItem(setTodoList, newItem, user) {
  
  let url = '/api/todo/add';
  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.token,
    },
    method: "POST",
    body: JSON.stringify({newItem}),
  })
  .then(response => response.json())
  .then(data => setTodoList(data))
  .catch(error => console.error(error));
}
