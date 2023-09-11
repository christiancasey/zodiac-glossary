import React from "react";
import { IoIosAddCircle, IoIosDownload } from "react-icons/io";

import Meaning from './Meaning';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meanings = props => {
  const {user} = React.useContext(UserContext);
  const [importable, setImportable] = React.useState(decideImportable());
  
  // Helper function to decide whether the import button should be visible of not
  // If the list is empty, it should be obviously (shortcut)
  // Alternatively, if the list already contains the main variant, hide the button
  // Otherwise, show it
  function decideImportable() {
    if (!props.lemma.meanings.length)
      return true;
    if (!props.lemma.primary_meaning)
      return false;
    if (props.lemma.meanings.some(meaning => 
      (meaning.value === props.lemma.primary_meaning)
    ))
      return false;
    return true;
  }

  // Make sure the importable flag gets reset whenever the values change
  React.useEffect(() => {
    setImportable(decideImportable());
  }, [props.lemma]);

  return (
    <div className={user.token ? styles.meanings : styles.meaningsPublic}>
      <h3>Meanings</h3>
      {props.lemma.meanings.map((meaning, i) => {
        return (
          <Meaning
            key={meaning.id}
            meaning={meaning}
            i={i}
            updateMeaning={props.updateMeaning}
            deleteMeaning={props.deleteMeaning}
            updateCategory={props.updateCategory}
            deleteCategory={props.deleteCategory}
            addNewCategory={props.addNewCategory}
            meaningsCategories={props.meaningsCategories}
          />
        )
      })}
      <div style={{display: (user.token ? 'block' : 'none')}}>
      {importable && (<button className={styles.add} onClick={e => props.addNewMeaning(e, {value: props.lemma.primary_meaning})}><IoIosDownload /></button>)}
        <button className={styles.add} onClick={props.addNewMeaning}><IoIosAddCircle /></button>
      </div>
    </div>
  );
};

export default Meanings;