import React from 'react';

import styles from '../Content.module.css'

// Things have changed on this branch!

// eslint-disable-next-line
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// eslint-disable-next-line
const WEBSITE_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
// eslint-disable-next-line
const PASSWORD_REGEX = /\w{20,}/;

const SignUp = props => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [username, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  
  const [validEmail, setValidEmail] = React.useState(false);
  const [validWebsite, setValidWebsite] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [validMatch, setValidMatch] = React.useState(false);

  const [enableSubmit, setEnableSubmit] = React.useState(false);

  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  React.useEffect(() => {
    setValidWebsite(WEBSITE_REGEX.test(website));
  }, [website]);

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
      username &&
      validEmail &&
      validWebsite &&
      validPassword &&
      validMatch
    );
    // console.log(flag);
    setEnableSubmit(flag);
  }, [firstName, lastName, username, validEmail, validWebsite, validPassword, validMatch]);

  function handleSubmit(event) {
    event.preventDefault();

    let url = '/api/users';
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        website: website.trim(),
        username: username.trim(),
        password: password.trim(),
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setMessage(`User ${data.username} created successfully. You will receive an email when your account is approved.`);
      // setEnableSubmit(false);
    })
    .catch(data => {
      setMessage(`There was an error creating your account. Please check your account information, or contact the administrator for help.`);
      setEnableSubmit(false);
    });
  }

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <div>
          {/* <p>Note that this feature is currently only available to members of the <a href="https://www.geschkult.fu-berlin.de/en/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">Zodiac Project</a>.</p> */}
          <p>All new registrations require direct approval from the Zodiac team.</p>
          <p>You will receive an email informing you whether your registration has been approved.</p>
        </div>
        <form style={{marginTop: '20px'}} onSubmit={handleSubmit}>

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
            <label className={styles.label} htmlFor="website">Website</label>
            <input
              className={styles.input}
              type="website"
              id="website"
              placeholder="website"
              value={website}
              onChange={e => {setWebsite(e.target.value.trim())}}
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              id="username"
              placeholder="username"
              value={username}
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
          <p className={styles.warning} style={(!website || validWebsite ? {display: 'none'} : null)}>
            Invalid website URL (must begin with http(s)://...).
          </p>
          <p className={styles.warning} style={(!password || validPassword ? {display: 'none'} : null)}>
            Passwords must contain at least twenty alphanumeric characters.<br />
            We recommend using the <a href="https://xkcd.com/936/" target="_blank" rel="noopener noreferrer">Correct Horse Battery Staple</a> method for generating a new password.
          </p>
          <p className={styles.warning} style={(!confirm || validMatch ? {display: 'none'} : null)}>
            Passwords do not match.
          </p>
          <p className={styles.warning} style={(!message ? {display: 'none'} : null)}>
            {message}
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