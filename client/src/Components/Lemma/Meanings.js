import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import Meaning from './Meaning';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meanings = props => {
  const meanings = props.meanings;
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.meanings}>
      <h3>Meanings</h3>
      {meanings.map((meaning, i) => {
        return (
          <Meaning 
            key={meaning.id}
            meaning={meaning}
            i={i}
            updateMeaning={props.updateMeaning}
            deleteMeaning={props.deleteMeaning}
          />
        )
      })}
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={props.addNewMeaning}><IoIosAddCircle /></button>
      </div>
    </div>
  );
};

export default Meanings;