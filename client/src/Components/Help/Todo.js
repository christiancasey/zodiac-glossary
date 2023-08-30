import React from 'react';

import styles from './Help.module.css';

import { getTodoList } from "../../Data/todo";

const Todo = props => {

  const [todoList, setTodoList] = React.useState([]);

  React.useEffect(() => {
    getTodoList(setTodoList);
  }, []);


  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Todo</h1>
        <p>I've put a todo list here for myself and so that everyone can see what's still pending.</p>
        <ul>
          {todoList.map(todo => (
            <li className={(todo.complete && styles.done)}> {todo.item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default Todo;