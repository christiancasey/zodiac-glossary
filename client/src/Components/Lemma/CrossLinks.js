import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import CrossLink from './CrossLink';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const CrossLinks = props => {
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.crossLinks}>
      <h3>Cross Links</h3>
      {props.crossLinks.map((crossLink, i) => {
        return (
          <CrossLink 
            key={crossLink.id} 
            crossLink={crossLink.link} 
            i={crossLink.id} 
            updateCrossLink={props.updateCrossLink}
            deleteCrossLink={props.deleteCrossLink}
          />
        )
      })}
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={props.addNewCrossLink}><IoIosAddCircle /></button>
      </div>
      
    </div>
  );
};

export default CrossLinks;