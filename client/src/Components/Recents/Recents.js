import React from 'react';

import styles from './Recents.module.css';

import { getLemmataListPromise, checkLemma } from '../../Data/api';
import UserContext from '../../Contexts/UserContext';

const LemmaCheck = props => {
  const [lemma, setLemma] = React.useState(props.lemma);
  const {user} = React.useContext(UserContext);

  const checkLemmaChange = (lemmaId, checked, field = "checked") => {
    // Don't mark the lemma as checked if the person clicking is the same as the editor
    if (lemma.editor === user.user.username) {
      checked = false;
    }
    checkLemma(lemmaId, checked, field, user.token);
    setLemma(prevLemma => ({
      ...prevLemma,
      [field]: checked,
    }));
    // props.updateNumChecked(lemmaId, checked);
  };

  return (
    <li key={lemma.lemmaId}>
      <label htmlFor="attention">Attention </label>
      <input
        name="attention"
        type="checkbox"
        checked={lemma.attention}
        onChange={e => checkLemmaChange(lemma.lemmaId, e.target.checked, 'attention')}
      />
      &nbsp;&nbsp;
      <label htmlFor="checked">Checked </label>
      <input
        name="checked"
        type="checkbox"
        checked={lemma.checked}
        onChange={e => checkLemmaChange(lemma.lemmaId, e.target.checked)}
      />
      &nbsp;&nbsp;
      <a 
        href={"/"+lemma.lemmaId} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={e => checkLemmaChange(lemma.lemmaId, true)}
      >
        — {lemma.editor} | {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}
      </a>
    </li>
  )
};

const Recents = props => {
  const {user} = React.useContext(UserContext);

  const [lemmata, setLemmata] = React.useState([]);

  React.useEffect(() => {
    getLemmataListPromise(user.token)
    .then(lemmata => setLemmata(lemmata))
    .catch(error => console.error(error));
  }, [user]);

  lemmata.sort((a, b) => (a.checked < b.checked ? -1 : 1)); // put checked ones at the bottom
  lemmata.sort((a, b) => (a.attention > b.attention ? -1 : 1)); // put ones that need attention at the top

  return (
    <div className={styles.content}>
      <div className={styles.container}>
      <h1>Recent Edits to Double Check</h1>
      {lemmata.map(lemma => (<LemmaCheck key={lemma.lemmaId} lemma={lemma} />))}
      </div>
    </div>
  );
};

export default Recents;