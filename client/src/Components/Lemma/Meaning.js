import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meaning = props => {
  const {user} = React.useContext(UserContext);
  const meaning = props.meaning;
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  const onChange = e => {
    props.updateMeaning(e.target.value, meaning.id);
  };
  
  return (
    <div 
      className={styles.row}
      onMouseEnter={e => {
        if (user.token)
          setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
    {/*{user.token && (
      <>
        <label className={styles.label} htmlFor={"meaning_"+meaning.id}>{i+1}</label>
        <input
          className={styles.inputMeaning}
          type="text"
          name={"meaning_"+meaning.id}
          placeholder="meaning"
          value={meaning.value}
          onChange={onChange}
        />
      </>
    )}
    {!user.token && (<div>{i+1} {meaning.value}</div>)} */}
    <>
      <label className={styles.label} htmlFor={"meaning_"+meaning.id}>{i+1}</label>
      <input
        className={styles.inputMeaning}
        type="text"
        name={"meaning_"+meaning.id}
        placeholder="meaning"
        value={meaning.value}
        onChange={onChange}
      />
    </>
    <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
    </div>
  );
};

export default Meaning;