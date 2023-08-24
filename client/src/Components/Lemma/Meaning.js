import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meaning = props => {
  const {user} = React.useContext(UserContext);
  const meaning = props.meaning;
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  if (user && !user.token) {
    return (
      <div 
        className={styles.row}
      >
        <h4>{i+1}</h4>
        <div className={styles.row}>
          <div className={styles.label}>Meaning</div>
          <div className={styles.label}>{meaning.value}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Category</div>
          <div className={styles.label}>{meaning.category}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Comment</div>
          <div className={styles.label}>{meaning.comment}</div>
        </div>
      </div>
    )
  }

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
      <label className={styles.label} htmlFor={"meaning_"+meaning.id}>{i+1}</label>
      <input
        style={{display: (user.token || meaning.value ? 'inline' : 'none')}}
        className={styles.inputMeaning}
        type="text"
        name={"meaning_"+meaning.id}
        id={"meaning_"+meaning.id}
        placeholder="meaning"
        value={meaning.value}
        onChange={e => props.updateMeaning('value', e.target.value, meaning.id)}
      />
      <input
        style={{display: (user.token || meaning.category ? 'inline' : 'none')}}
        className={styles.inputMeaning}
        type="text"
        name={"category_"+meaning.id}
        id={"category_"+meaning.id}
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
      <input
        style={{display: (user.token || meaning.comment ? 'inline' : 'none')}}
        className={styles.inputMeaning}
        type="text"
        name={"comment_"+meaning.id}
        id={"comment_"+meaning.id}
        placeholder={user.token ? "comment" : ''}
        value={(meaning.comment ? meaning.comment : '')}
        onChange={e => props.updateMeaning('comment', e.target.value, meaning.id)}
      />
      <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
    </div>
  );
};

export default Meaning;