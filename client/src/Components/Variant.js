import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../Contexts/UserContext';

import styles from './Lemma.module.css';

const Variant = props => {
  const variant = props.variant;
  const i = props.i;
  const {user} = React.useContext(UserContext);
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  return (
    <div 
      className={styles.row}
      onMouseEnter={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      {/*{user.token && (
        <>
          <label className={styles.label} htmlFor={"original_"+variant.id}>{i+1}</label>
          <input
            className={styles.input}
            type="text"
            name={"original_"+variant.id}
            placeholder="original"
            value={variant.original}
            onChange={e => props.updateVariant("original", e.target.value, variant.id)} 
          />
          <input
            className={styles.inputTransliteration}
            type="text"
            name={"transliteration_"+variant.id}
            placeholder="transliteration"
            value={variant.transliteration}
            onChange={e => props.updateVariant("transliteration", e.target.value, variant.id)} 
          />
        </>
      )}
      {!user.token && (<div>{i+1} {variant.original} {variant.transliteration}</div>)} */}
      <>
        <label className={styles.label} htmlFor={"original_"+variant.id}>{i+1}</label>
        <input
          className={styles.input}
          type="text"
          name={"original_"+variant.id}
          placeholder="original"
          value={variant.original}
          onChange={e => props.updateVariant("original", e.target.value, variant.id)} 
        />
        <input
          className={styles.inputTransliteration}
          type="text"
          name={"transliteration_"+variant.id}
          placeholder="transliteration"
          value={variant.transliteration}
          onChange={e => props.updateVariant("transliteration", e.target.value, variant.id)} 
        />
      </>
      <div style={{display: (user.token ? 'inline' : 'none')}}>
        <button className={styles.delete} style={style} onClick={() => props.deleteVariant(variant.id)}><IoIosTrash /></button>
      </div>
    </div>
  );
};

export default Variant;