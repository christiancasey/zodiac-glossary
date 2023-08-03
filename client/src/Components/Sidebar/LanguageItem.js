import React from "react";
import styles from '../Content.module.css';

function LanguageItem(props) {
  return (
    <li className={styles.lemmaList}>
      <input 
        type="checkbox"
        className={styles.checkbox}
        checked={props.language.active}
        onChange={() => props.selectLanguage(props.language.id)}
      />
      &nbsp;
      {props.language.label}
    </li>
  );
}

export default LanguageItem;

// IF YOU DECIDE TO REPLACE THE CHECKBOXES WITH TOGGLES (CDC 02-03-2022)
// import { BsToggleOn, BsToggleOff } from "react-icons/bs";
// {props.language.active ? <BsToggleOn /> : <BsToggleOff />}