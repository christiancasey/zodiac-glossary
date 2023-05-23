import React from 'react';
// import ReactTooltip from 'react-tooltip'; // Maybe add a tooltip to the pause button

import { useNavigate } from "react-router-dom";
// import { IoIosPlay, IoIosPause, IoIosHome, IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { IoIosHome, IoIosHelpCircle, IoIosClock } from 'react-icons/io';

import UserContext from '../../Contexts/UserContext';
import LogIn from './LogIn.js';

import styles from './StarHeader.module.css';

import zodiacConstellations from '../../Graphics/zodiac_constellations.svg';
// import zodiacLogo from '../Graphics/zodiac_logo.svg';

const StarHeader = () => {
  const {user, setUser} = React.useContext(UserContext);
  let navigate = useNavigate();
  const [loginVisible, setLoginVisible] = React.useState(false);
  
  // React.useEffect(() => {
  //   setUser({token: null});
  // }, []);

  let startStyle;
  if (localStorage.getItem('pauseStarChart') === 'true') {
    startStyle = {animationPlayState: 'paused'};
  } else {
    startStyle = {animationPlayState: 'running'};
  }
  startStyle = {animationPlayState: 'paused'};
  const [style, setStyle] = React.useState(startStyle);

  React.useEffect(() => {
    setUser({token: true});
    localStorage.setItem('token', true);
  }, []);
  
  // Commented out to suppress annoying React warning that clutters up the console
  // Reinstate when authentication stuff is ready
  // CDC 2022-11-08
  // function logout() {
  //   setUser({token: null});
  //   localStorage.removeItem('token');
  //   setLoginVisible(false);
  // }
  
  // function login() {
  //   setLoginVisible(true);
  // }
  
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
      <a className={styles.home} href="/recents" target="_blank" rel="noopener noreferrer">
        <IoIosClock />
      </a>
      {/* {(user && user.token) ? null : (
        <button className={styles.home} onClick={login}>
          <IoIosLogIn />
        </button>
      )}
      {(user && user.token) ? (
        <button className={styles.home} onClick={logout}>
          <IoIosLogOut />
        </button>
      ) : null} */}
      {(user && user.token) ? (
        <div className={styles.username}>{user.username}</div>
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
        <h1 className={styles.zodiacLogotype}>
          Zodiac
        </h1>
      </header>
      <div className={styles.headerBodyGradient}></div>
      <div className={styles.bodyBackground}></div>
    </>
  );
};

export default StarHeader;

// <img src={zodiacLogo} style={{height: '5vw'}} alt="Zodiac logo"/>