import React from 'react';

import styles from './SignUp.module.css';

// eslint-disable-next-line
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// eslint-disable-next-line
const PASSWORD_REGEX = /\w{20,}/;

const SignUp = props => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  
  const [validEmail, setValidEmail] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [validMatch, setValidMatch] = React.useState(false);

  const [enableSubmit, setEnableSubmit] = React.useState(false);

  React.useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  React.useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  React.useEffect(() => {
    setValidMatch(password === confirm);
  }, [password, confirm]);

  React.useEffect(() => {
    const flag = (
      firstName &&
      lastName &&
      userName &&
      validEmail &&
      validPassword &&
      validMatch
    );
    // console.log(flag);
    setEnableSubmit(flag);
  }, [firstName, lastName, userName, validEmail, validPassword, validMatch]);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <p>Note that this feature is currently only available to members of the <a href="https://www.geschkult.fu-berlin.de/en/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">Zodiac Project</a>.</p>
        <p>All new registrations require direct approval from the Zodiac team.</p>
        <form style={{marginTop: '20px'}}>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="firstName">First Name</label>
            <input
              className={styles.input}
              type="text"
              id="firstName"
              placeholder="first name"
              value={firstName}
              onChange={e => {setFirstName(e.target.value)}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="lastName">Last Name</label>
            <input
              className={styles.input}
              type="text"
              id="lastName"
              placeholder="last name"
              value={lastName}
              onChange={e => {setLastName(e.target.value)}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              className={styles.input}
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={e => {setEmail(e.target.value.trim())}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="userName">Username</label>
            <input
              className={styles.input}
              type="text"
              id="userName"
              placeholder="username"
              value={userName}
              onChange={e => {setUserName(e.target.value)}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={e => {setPassword(e.target.value)}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="confirm">Confirm</label>
            <input
              className={styles.input}
              type="password"
              id="confirm"
              placeholder="confirm"
              value={confirm}
              onChange={e => {setConfirm(e.target.value)}}
              required
            />
          </div>

          <p className={styles.warning} style={(!email || validEmail ? {display: 'none'} : null)}>
            Invalid email address.
          </p>
          <p className={styles.warning} style={(!password || validPassword ? {display: 'none'} : null)}>
            Passwords must contain at least twenty alphanumeric characters.<br />
            We recommend using the <a href="https://xkcd.com/936/" target="_blank" rel="noopener noreferrer">Correct Horse Battery Staple</a> method for generating a new password.
          </p>
          <p className={styles.warning} style={(!confirm || validMatch ? {display: 'none'} : null)}>
            Passwords do not match.
          </p>

          <button
            className={styles.signUp}
            disabled={!enableSubmit}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
};

export default SignUp;