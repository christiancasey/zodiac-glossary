import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meaning = props => {
  const {user} = React.useContext(UserContext);
  const meaning = props.meaning;
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
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
          className={styles.input}
          type="text"
          name={"meaning_"+meaning.id}
          placeholder="meaning"
          value={meaning.value}
          onChange={e => props.updateMeaning('value', e.target.value, meaning.id)}
        />
        <input
          className={styles.input}
          type="text"
          name={"category_"+meaning.id}
          placeholder="category"
          value={meaning.category}
          onChange={e => props.updateMeaning('category', e.target.value, meaning.id)}
          list="meaning_categories"
        />
        <datalist id="meaning_categories">
          {props.meaningsCategories.map((category, key) => (
            <option
              key={key}
              value={category}
            />
          ))}
        </datalist>
      </>
      <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
    </div>
  );
};

export default Meaning;