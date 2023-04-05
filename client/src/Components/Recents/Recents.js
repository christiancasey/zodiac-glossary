import React from 'react';

import styles from './Recents.module.css';

import { getLemmataListPromise, checkLemma } from '../../Data/api';

const LemmaCheck = props => {
  const [lemma, setLemma] = React.useState(props.lemma);

  const checkLemmaChange = (lemmaId, checked, field = "checked") => {
    checkLemma(lemmaId, checked, field);
    setLemma(prevLemma => ({
      ...prevLemma,
      [field]: checked,
    }));
    props.updateNumChecked(lemmaId, checked);
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
}
const WeekBatch = props => {
  const getNumChecked = () => {
    return props.batch.lemmata.reduce((num, curr) => num + curr.checked, 0);
  };
  const [numChecked, setNumChecked] = React.useState(getNumChecked());

  const updateNumChecked = (lemmaId, checked) => {
    props.batch.lemmata.find(lemma => lemma.lemmaId === lemmaId).checked = checked;
    setNumChecked(getNumChecked());
  }
  
  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <>
      <h2> Before {props.batch.anteQuem.toLocaleDateString("en-US", dateFormat)}</h2>
      <p>{props.batch.lemmata.length-numChecked} left to check out of {props.batch.lemmata.length} total this week.</p>
      <ol>
        {props.batch.lemmata.map(lemma => (
          <LemmaCheck key={lemma.lemmaId} lemma={lemma} updateNumChecked={updateNumChecked} />
        ))}
      </ol>
    </>
  )
};

const Recents = props => {

  const [lemmata, setLemmata] = React.useState([]);

  React.useEffect(() => {
    getLemmataListPromise()
    .then(lemmata => setLemmata(lemmata))
    .catch(error => console.error(error));
  }, []);

  let today = new Date();
  let zodiacStart = new Date("2023-01-01 10:00");
  let nextMonday = new Date();
  nextMonday.setDate(today.getDate() - today.getDay() + 8);
  nextMonday.setHours(10, 0, 0, 0);

  let weeklyLemmata = [];

  while (nextMonday > zodiacStart) {
    
    let prevMonday = new Date(nextMonday);
    prevMonday.setDate(prevMonday.getDate() - 7);

    let newLemmata = lemmata.filter(lemma => (lemma.last_edit > prevMonday && lemma.last_edit < nextMonday));
    newLemmata.sort((a, b) => (a.checked < b.checked ? -1 : 1)); // put checked ones at the bottom
    newLemmata.sort((a, b) => (a.attention > b.attention ? -1 : 1)); // put ones that need attention at the top

    let week = {
      id: nextMonday.getTime(),
      anteQuem: new Date(nextMonday),
      postQuem: new Date(prevMonday),
      lemmata: newLemmata,
    };

    nextMonday.setDate(nextMonday.getDate() - 7);

    if (!newLemmata.length) {
      continue;
    }

    weeklyLemmata.push(week);
  }

  return (
    <div className={styles.content}>
      <div className={styles.container}>
      <h1>Recent Edits</h1>
      {weeklyLemmata.map(weekBatch => (<WeekBatch key={weekBatch.id} batch={weekBatch} />))}
      </div>
    </div>
  );
};

export default Recents;