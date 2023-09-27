import React from 'react';

import styles from '../Content.module.css'

import { getTodoList, addTodoListItem } from "../../Data/todo";

import UserContext from '../../Contexts/UserContext';

const Contributors = props => {
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
        <h1>Contributors</h1>
        <ul className={styles.stars}>
          <li>Page under construction...</li>
        </ul>
      </div>
    </div>
  )
};

export default Contributors;