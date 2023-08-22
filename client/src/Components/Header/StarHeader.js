import React from 'react';
import ReactTooltip from 'react-tooltip';

import { useNavigate } from "react-router-dom";
// import { IoIosPlay, IoIosPause, } from 'react-icons/io';
import { IoIosHome, IoIosHelpCircle, IoIosClock, IoIosLogIn, IoIosLogOut, } from 'react-icons/io';

import UserContext from '../../Contexts/UserContext';
import LogIn from './LogIn.js';

import styles from './StarHeader.module.css';

import zodiacConstellations from '../../Graphics/zodiac_constellations.svg';
// import zodiacLogo from '../Graphics/zodiac_logo.svg';

const StarHeader = () => {
  const {user, setUser} = React.useContext(UserContext);
  let navigate = useNavigate();
  const [loginVisible, setLoginVisible] = React.useState(false);

  let startStyle;
  if (localStorage.getItem('pauseStarChart') === 'true') {
    startStyle = {animationPlayState: 'paused'};
  } else {
    startStyle = {animationPlayState: 'running'};
  }
  startStyle = {animationPlayState: 'paused'};
  const [style, setStyle] = React.useState(startStyle);
  
  function logout() {
    const emptyUser = {user: {}, token: null};
    setUser(emptyUser);
    localStorage.setItem('user', JSON.stringify(emptyUser));
    setLoginVisible(false);
  }
  
  function login() {
    setLoginVisible(true);
  }
  
  const playPause = () => {
    setStyle(prevStyle => {
      if (prevStyle.animationPlayState === 'running') {
        localStorage.setItem('pauseStarChart', true);
        return {animationPlayState: 'paused'};
      }
      localStorage.setItem('pauseStarChart', false);
      return {animationPlayState: 'running'};
    });
  };
  
  const goHome = () => {
    navigate('/');
  }
  
  return (
    <>
      <button className={styles.home} onClick={goHome}>
        <IoIosHome />
      </button>
      <a className={styles.home} href="/help" target="_blank" rel="noopener noreferrer">
        <IoIosHelpCircle />
      </a>
      {(user && user.token) ? (
        <a className={styles.home} href="/recents" target="_blank" rel="noopener noreferrer">
          <IoIosClock />
        </a>
      ) : null}
      {(user && user.token) ? null : (
        <button className={styles.home} onClick={login}>
          <IoIosLogIn />
        </button>
      )}
      {(user && user.token) ? (
        <button className={styles.home} onClick={logout}>
          <IoIosLogOut />
        </button>
      ) : null}
      {(user.user.username) ? (
        <div className={styles.username}> &nbsp;{user.user.username}</div>
      ) : null}
      {/* <button className={styles.playPause} onClick={playPause}>
        {(style.animationPlayState === 'running') ? (<IoIosPause />) : <IoIosPlay />}
      </button> */}
      <LogIn
        visible={loginVisible}
        setLoginVisible={setLoginVisible}
      />
      <header className={styles.header} onClick={() => playPause()}>
        <img
          style={style}
          className={styles.starChart}
          src={zodiacConstellations}
          alt="Star chart with zodiac constellations"
          onClick={playPause}
        />
        <p className={styles.titleThe}>The</p>
        <h1 className={styles.zodiacLogotype}>
          Zodiac
        </h1>
        <p className={styles.titleGlossary}>
          Glossary
          <sup
            data-tip='This project is currently in a beta stage. Please forgive any errors.'
            data-for="beta"
          >
            β
          </sup>
          <ReactTooltip id="beta" type="light" html={true} />
        </p>
      </header>
      <div className={styles.headerBodyGradient}></div>
      <div className={styles.bodyBackground}></div>
    </>
  );
};

export default StarHeader;

// <img src={zodiacLogo} style={{height: '5vw'}} alt="Zodiac logo"/>