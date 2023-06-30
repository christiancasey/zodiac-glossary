import React from "react";
import { IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Variant = props => {
  const variant = props.variant;
  const i = props.i;
  const {user} = React.useContext(UserContext);
  
  const [style, setStyle] = React.useState({display: 'none'});

  if (user && !user.token) {
    return (
      <div 
        className={styles.row}
      >
        <h4>{i+1}</h4>
        <div className={styles.row}>
          <div className={styles.label}>{props.language === "akkadian" ? 'Normalized' : 'Transliteration'}</div>
          <div className={styles.label} style={{fontStyle: (props.language === "akkadian" || 'italic')}}>{variant.transliteration}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>{props.language === "akkadian" ? 'Transliteration' : 'Original'}</div>
          <div className={styles.label}>{variant.original}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Comment</div>
          <div className={styles.label}>{variant.comment}</div>
        </div>
      </div>
    )
  }
  
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
      <label className={styles.label} htmlFor={"original_"+variant.id}>{i+1}</label>
      <input
        style={{
          display: (user.token || variant.transliteration ? 'inline' : 'none'),
          fontStyle: (props.language === "akkadian" || 'italic')
        }}
        className={styles.input}
        type="text"
        name={"transliteration_"+variant.id}
        placeholder={user.token ? (props.language === "akkadian" ? 'normalized' : 'transliteration') : ''}
        value={variant.transliteration}
        onChange={e => props.updateVariant("transliteration", e.target.value, variant.id)} 
      />
      <input
        style={{display: (user.token || variant.original ? 'inline' : 'none')}}
        className={styles.input}
        type="text"
        name={"original_"+variant.id}
        placeholder={user.token ? (props.language === "akkadian" ? 'transliteration' : 'original') : ''}
        value={(variant.original ? variant.original : '')}
        onChange={e => props.updateVariant("original", e.target.value, variant.id)} 
      />
      <input
        style={{display: (user.token || variant.comment ? 'inline' : 'none')}}
        className={styles.inputMeaning}
        type="text"
        name={"comment_"+variant.id}
        placeholder={user.token ? "comment" : ''}
        value={(variant.comment ? variant.comment : '')}
        onChange={e => props.updateVariant("comment", e.target.value, variant.id)} 
      />
      <div style={{display: (user.token ? 'inline' : 'none')}}>
        <button className={styles.delete} style={style} onClick={() => props.deleteVariant(variant.id)}><IoIosTrash /></button>
      </div>
    </div>
  );
};

export default Variant;