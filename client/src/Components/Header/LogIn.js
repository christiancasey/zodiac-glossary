import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosCloseCircle } from "react-icons/io";

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

    let url = '/api/users/login';
    
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({username, password}),
    })
    .then(response => response.json())
    .then(data => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setInvalidLogin(false);
      props.setLoginVisible(false);
    })
    .catch(data => {
      const emptyUser = {user: {}, token: null};
      setUser(emptyUser);
      localStorage.setItem('user', JSON.stringify(emptyUser));
      setInvalidLogin(true);
    });
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
              id="username"
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
              id="password"
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
            <Link 
              className={styles.signupButton}
              to="/signup"
              onClick={event => props.setLoginVisible(false)}
            >
              Sign up
            </Link>
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