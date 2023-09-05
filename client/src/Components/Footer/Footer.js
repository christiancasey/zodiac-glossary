import React from 'react';
// import ReactTooltip from 'react-tooltip';

// import { useNavigate } from "react-router-dom";
// import { IoIosPlay, IoIosPause, } from 'react-icons/io';
// import { IoIosHome, IoIosHelpCircle, IoIosClock, IoIosLogIn, IoIosLogOut, IoIosList, } from 'react-icons/io';

// import UserContext from '../../Contexts/UserContext';

import styles from './footer.module.css';

// import zodiacConstellations from '../../Graphics/zodiac_constellations.svg';
import zodiacLogo from '../../Graphics/zodiac_logo.svg';
import fuLogo from '../../Graphics/fu_logo.svg';
import ercLogo from '../../Graphics/erc_logo.svg';

const Footer = () => {
  // const {user, setUser} = React.useContext(UserContext);
  // let navigate = useNavigate();
  
  // const goHome = () => {
  //   navigate('/');
  // }
  
  return (
    <footer>
			<div className={styles.logoSpread}>
				<div className={styles.logoItem}>
					<a href="https://www.geschkult.fu-berlin.de/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">
						<img src={zodiacLogo} style={{height: '4vw'}} alt="Zodiac logo" />
					</a>
				</div>
				<div className={styles.logoItem}>
					<a href="https://www.fu-berlin.de/" target="_blank" rel="noopener noreferrer">
						<img src={fuLogo} style={{height: '4vw'}} alt="Freie Universität Berlin logo" />
					</a>
				</div>
				<div className={styles.logoItem}>
					<a href="https://erc.europa.eu/" target="_blank" rel="noopener noreferrer">
						<img src={ercLogo} style={{height: '4vw'}} alt="European Research Council logo" />
					</a>
				</div>
			</div>
    </footer>
  );
};

export default Footer;

// <img src={zodiacLogo} style={{height: '5vw'}} alt="Zodiac logo"/>