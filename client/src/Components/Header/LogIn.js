import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios';

import UserContext from '../../Contexts/UserContext';

import styles from './StarHeader.module.css';

const LogIn = props => {
  const style = (props.visible ? {display: 'block'} : {display: 'none'});
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [invalidLogin, setInvalidLogin] = React.useState(false);
  const {setUser} = React.useContext(UserContext);
  
  function handleSubmit(event) {
    event.preventDefault();
    
    // login user
    axios.post('https://reqres.in/api/login', {username, password})
      .then(({data}) => {
        // set token in localStorage
        localStorage.setItem('token', data.token);
        setUser({
          username,
          password,
          token: data.token
        });
        localStorage.setItem('token', data.token);
        setInvalidLogin(false);
        props.setLoginVisible(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response.status === 400) {
          setInvalidLogin(true);
          setUser({
            username,
            password,
            token: null
          });
        }
      })
  }
  
  return (
    <div className={styles.login} style={style}>
      <button
        className={styles.close}
        onClick={event => props.setLoginVisible(false)}
      >
        <IoIosCloseCircle />
      </button>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <table><tbody>
        <tr>
          <td><label className={styles.label} htmlFor="username">Username</label></td>
          <td>
            <input
              name="username"
              className={styles.input}
              type="text"
              placeholder="Username..."
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td><label className={styles.label} htmlFor="password">Password</label></td>
          <td>
            <input
              name="password"
              className={styles.input}
              type="password"
              placeholder="Password..."
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <button className={styles.loginButton} type="submit">Log in</button>
          </td>
          <td>
            <div className={styles.invalidLogin} style={{display: invalidLogin ? 'block' : 'none'}}>
              Incorrect login.<br />
              {/*<a href="#">Forgot password?</a>*/}
            </div>
          </td>
        </tr>
        </tbody></table>
      </form>
    </div>
  )
};

export default LogIn;