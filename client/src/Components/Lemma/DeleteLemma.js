import React from "react";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const DeleteLemma = props => {
  const [style, setStyle] = React.useState({display: 'none'});
  const [deleteInput, setDeleteInput] = React.useState('');
  const {user} = React.useContext(UserContext);
  
  const startDeletionProcess = e => {
    e.preventDefault();
    setDeleteInput('');
    if (e.target[0].value === props.lemma.original) {
      props.deleteLemma(props.lemma.lemmaId);
    }
  };
  
  const onChange = e => {
    setDeleteInput(e.target.value);
  }
  
  return (
    <div 
      className={styles.deleteLemma} 
      onClick={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
      style={{display: (user.token ? 'block' : 'none')}}
    >
      <h3>Delete Lemma</h3>
      <form style={style} onSubmit={startDeletionProcess}>
        <p>
          Type the lemma ({props.lemma.original}) and press return to delete.
        </p>
        <p>
          Deleting cannot be undone!
        </p>
        <p>&nbsp;</p>
        <div>
          <input
            type="text"
            id="delete-confirm"
            className={styles.inputDelete}
            value={deleteInput}
            onChange={onChange}
          />
        </div>
      </form>
    </div>
  );
};

export default DeleteLemma;