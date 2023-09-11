import React from 'react';

import styles from './Help.module.css';

import { getTodoList, addTodoListItem } from "../../Data/todo";

import UserContext from '../../Contexts/UserContext';

const Todo = props => {
  const [todoList, setTodoList] = React.useState([]);
  const [newItem, setNewItem] = React.useState('');
  const {user} = React.useContext(UserContext);

  React.useEffect(() => {
    getTodoList(setTodoList);
  }, []);

  const updateNewItem = event => {
    setNewItem(event.target.value);
  };

  const submitNewItem = event => {
    if (event.code === "Enter") {
      if (user.token) {
        addTodoListItem(setTodoList, newItem, user);
        setNewItem('');
      }
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Todo</h1>
        <ul className={styles.stars}>
          {user.token && (
            <li key={"new"}>
              <input 
                className={styles.input}
                type="text"
                name="newTodoItem"
                placeholder="New item (press return to add)"
                value={newItem}
                onChange={e => updateNewItem(e)}
                onKeyDown={submitNewItem}
              />
            </li>
          )}
          {todoList.map(todo => (
            <li key={todo.id}>
              <span className={(todo.complete ? styles.done : "false")}>
                {todo.item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default Todo;