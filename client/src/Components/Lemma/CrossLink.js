import React from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import QueryNavLink from '../QueryNavLink';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';



const CrossLink = props => {
  let lemmata = props.lemmataList;
  const i = props.i;
  const {user} = React.useContext(UserContext);
  const [crossLink, setCrossLink] = React.useState(props.crossLink);

  // Changed to a normal variable to ensure it updates before the component.
  // Before, things were taking to long to load, leaving sample links blank – CDC 2023-04-25
  // const [lemma, setLemma] = React.useState(getLemmaById(lemmata, props.crossLink)); 
  //////////////
  // This did not fix it. Need to come back and try again after auth is done – CDC 2023-05-23
  let lemma = getLemmaById(lemmata, props.crossLink);
  
  const [style, setStyle] = React.useState({display: 'none'});

  function getLemmaById(lemmataList, id) {
    return lemmataList.find(lemma => lemma.lemmaId === parseInt(id));
  }
  
  // Needed to make sure the crossLinks update when the user follows a crossLink to a new lemma
  React.useEffect(() => {
    setCrossLink(props.crossLink);
    // setLemma(getLemmaById(lemmata, props.crossLink));
    lemma = getLemmaById(lemmata, props.crossLink);
  }, [props.crossLink, crossLink]);
  
  function updateCrossLink(event, id) {
    const updatedCrossLink = parseInt(event.target.value);
    if (updatedCrossLink) {
      props.updateCrossLink(updatedCrossLink, id);
      setCrossLink(updatedCrossLink);
      // setLemma(getLemmaById(lemmata, event.target.value));
      lemma = getLemmaById(lemmata, props.crossLink);
    }
  }

  // Public view, placed before filter to shorten load time –CDC 2023-09-19
  if (!user.token) {
    if (!lemma || !lemma.published)
      return <></>;
    
    return (
      <div className={styles.label}>
        <QueryNavLink to={'/'+crossLink}>
          {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}
          &nbsp;
          <IoIosOpen />
        </QueryNavLink>
      </div>
    )
  }

  // Filter current lemma out of list of possible Cross Links
  // Also filter out any Cross Links that have already been added
  lemmata = lemmata.filter(cursorLemma => cursorLemma.lemmaId !== props.currentLemma.lemmaId);
  for (let cursorCrossLink of props.currentLemma.crossLinks) {
    lemmata = lemmata.filter(cursorLemma => 
      (
        cursorLemma.lemmaId !== cursorCrossLink.lemmaId
        &&
        cursorLemma.lemmaId !== cursorCrossLink.link
      )
    );
  }

  return (
    <div 
      className={styles.crossLinksList}
      onMouseEnter={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"crossLink_"+i}
          data-tip="A link to the related lemma.<br />Do not modify this value manually.<br />Use the selector to fill."
          data-for={"crossLink_"+i+"-tooltip"}
        >
          Linked ID
        </label>
        <ReactTooltip id={"crossLink_"+i+"-tooltip"} type="light" html={true} />
        <input 
          list={"lemmata_list" + i}
          className={styles.inputWide}
          name={"crossLink_"+i}
          id={"crossLink_"+i}
          defaultValue={crossLink}
          onChange={event => updateCrossLink(event, i)}
        />
        <datalist id={"lemmata_list" + i}>
          {lemmata.map((lemma, j) => (
            <option
              key={j}
              label={lemma.transliteration + ' | ' + lemma.original + ' | ' + lemma.primary_meaning}
              data-id={lemma.lemmaId}
              value={lemma.lemmaId} 
            />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <div
          className={styles.label}
        >
          Sample Link
        </div>
        {lemma ? 
          <QueryNavLink className={styles.label} to={'/'+crossLink} target="_blank" rel="noopener noreferrer">
            <>&nbsp;{lemma.transliteration} | {lemma.original} | {lemma.primary_meaning} <IoIosOpen /></>
          </QueryNavLink>
        : <> | | </>}
      </div>
      
      <div style={{display: (user.token ? 'inline' : 'none')}}>
        <button className={styles.add} style={style} onClick={() => props.deleteCrossLink(i)}><IoIosTrash /></button>
      </div>
    </div>
  );
};

export default CrossLink;