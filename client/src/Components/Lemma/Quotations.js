import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import Quotation from './Quotation';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Quotations = props => {
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.quotations}>
      <h3>Quotations</h3>
      {props.quotations.map((quotation, quotationIndex) => {
        return (
          <Quotation
            key={quotation.id}
            language={props.language}
            quotation={quotation} 
            quotationIndex={quotationIndex} 
            meanings={props.meanings}
            updateQuotation={props.updateQuotation}
            deleteQuotation={props.deleteQuotation}
          />
        )
      })}
      
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={props.addNewQuotation}><IoIosAddCircle /></button>
      </div>
      
    </div>
  );
};

export default Quotations;