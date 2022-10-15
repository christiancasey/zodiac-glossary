import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";


import styles from './Keyboards.module.css';

import keyboardData from '../Data/keyboard-data.json';

const keyClick = (e, keyClick, key) => {
  e.preventDefault();
  keyClick(key);
}

const StandardKeyboard = props => {
  const keys = props.keyboard.keys;
  return (
    <div>
      <button className={styles.deleteKey} onClick={e => keyClick(e, props.keyClick, 'delete')}><RiDeleteBack2Fill /></button>
      {keys.map((row,i) => {
        return (
          <div key={i}>
            {row.map((key,j) => {
              return (
                <button className={styles.key} key={j} onClick={e => keyClick(e, props.keyClick, key)}>{key}</button>
              );
            })}
          </div>
        )
      })}
      <button className={styles.spaceKey} onClick={e => keyClick(e, props.keyClick, ' ')}>&nbsp;</button>
    </div>
  );
};

const MultipageKeyboardPage = props => {
  return (
    <div className="key-row">
      {props.page.keys.map((key,i) => {
        return (
          <button className={styles.multipageKey} key={i} onClick={e => keyClick(e, props.keyClick, key)}>{key}</button>
        );
      })}
    </div>
  )
}

const MulitpageKeyboard = props => {
  const [pageId, updatePageId] = React.useState(1);
  let page = props.keyboard.pages.find(page => page.pageId === pageId);
  
  return (
    <div>
      <div>
        {props.keyboard.pages.map(page => {
          return (
            <button className={styles.pageKey} key={page.pageId} onClick={e => updatePageId(page.pageId)}>{page.pageLabel}</button>
          )
        })}
      </div>
      <button className={styles.deleteKey} onClick={e => keyClick(e, props.keyClick, 'delete')}><RiDeleteBack2Fill /></button>
      <MultipageKeyboardPage
        page={page}
        keyClick={props.keyClick}
      />
    </div>
  );
};

const KeyboardContainer = props => {
  let keyboard = props.keyboardData.filter(keyboard => {
    if (keyboard.script === props.script) {
      return keyboard;
    }
    return null;
  });
  
  // Avoid an out of range error later if filter failed to return a value
  if (keyboard.length < 1)
    return <>Error: No matching keyboard loaded.</>
  
  keyboard = keyboard[0];
  
  if (keyboard.keyboardType === 'standard') {
    return (
      <StandardKeyboard
        keyboard={keyboard}
        keyClick={props.keyClick}
      />
    );
  }
  else if (keyboard.keyboardType === 'multipage') {
    return (
      <MulitpageKeyboard
        keyboard={keyboard}
        keyClick={props.keyClick}
      />
    );
  }
  
  return <>Error: Unknown keyboard type.</>;
};

const KeyboardSelector = props => {
  const [script, updateScript] = React.useState(props.keyboardData[0].script);
  
  return (
    <>
      {props.keyboardData.map(keyboard => {
        return (
          <button className={keyboard.script === script ? styles.scriptTabSelected : styles.scriptTab} key={keyboard.id} onClick={e => updateScript(keyboard.script)}>
            {keyboard.scriptLabel}
          </button>
        );
      })}
      <KeyboardContainer
        keyboardData={props.keyboardData}
        script={script}
        keyClick={props.keyClick}
      />
    </>
  );
};

const Keyboards = props => {
  
  return (
    
    <div className={props.visible ? styles.fadeIn : styles.fadeOut}>
      <div className={styles.keyboard}>
        <button className={styles.close} onClick={props.keyboardClick}><IoIosCloseCircle /></button>
        <KeyboardSelector
          keyboardData={keyboardData}
          keyClick={props.keyClick}
        />
      </div>
    </div>
  );
};

export default Keyboards;