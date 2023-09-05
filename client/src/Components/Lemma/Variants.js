import React from 'react';
import { IoIosAddCircle, IoIosDownload } from "react-icons/io";

import Variant from './Variant';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Variants = props => {
  const {user} = React.useContext(UserContext);
  const [importable, setImportable] = React.useState(decideImportable());

  // Helper function to decide whether the import button should be visible of not
  // If the list is empty, sure it should be obviously
  // Alternatively, if the list already contains the main variant, hide the button
  // Otherwise, show it
  function decideImportable() {
    if (!props.lemma.variants.length)
      return true;
    if (!props.lemma.original && !props.lemma.transliteration)
      return false;
    if (props.lemma.variants.some(variant => 
      (variant.original === props.lemma.original 
        && variant.transliteration === props.lemma.transliteration)
    ))
      return false;
    return true;
  }

  // Make sure the importable flag gets reset whenever the values change
  React.useEffect(() => {
    setImportable(decideImportable());
  }, [props.lemma]);
  
  return (
    <div className={user.token ? styles.variants : styles.variantsPublic}>
      <h3>Variants</h3>
      {props.lemma.variants.map((variant,i) => {
        return (
          <Variant
            key={variant.id}
            variant={variant}
            language={props.lemma.language}
            i={i}
            updateVariant={props.updateVariant}
            deleteVariant={props.deleteVariant}
          />
        )
      })}
      
      <div style={{display: (user.token ? 'block' : 'none')}}>
        {importable && (<button className={styles.add} onClick={e => props.addNewVariant(e, {original: props.lemma.original, transliteration: props.lemma.transliteration})}><IoIosDownload /></button>)}
        <button className={styles.add} onClick={props.addNewVariant}><IoIosAddCircle /></button>
      </div>
    </div>
  );
};

export default Variants;