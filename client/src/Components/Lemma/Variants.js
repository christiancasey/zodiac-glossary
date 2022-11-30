import React from 'react';
import { IoIosAddCircle } from "react-icons/io";

import Variant from './Variant';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Variants = props => {
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.variants}>
      <h3>Variants</h3>
      {props.variants.map((variant,i) => {
        return (
          <Variant
            key={variant.id}
            variant={variant}
            i={i}
            updateVariant={props.updateVariant}
            deleteVariant={props.deleteVariant}
          />
        )
      })}
      
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={props.addNewVariant}><IoIosAddCircle /></button>
      </div>
    </div>
  );
};

export default Variants;