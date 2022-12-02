import React from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import { getLemma, getLemmataList } from "../../Data/sample-data";

import QueryNavLink from '../QueryNavLink';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const CrossLink = props => {
  const {user} = React.useContext(UserContext);
  const [crossLink, setCrossLink] = React.useState(props.crossLink);
  const [lemma, setLemma] = React.useState(getLemma(props.crossLink));
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  // Needed to make sure the crossLinks update when the user follows a crossLink to a new lemma
  React.useEffect(() => {
    setCrossLink(props.crossLink);
    setLemma(getLemma(props.crossLink));
  }, [props.crossLink, crossLink]);
  
  if (!user.token) {
    if (!lemma || !lemma.published)
      return <></>;
    
    return (
      <div className={styles.label}>
        <QueryNavLink to={'/zodiac-routing/'+crossLink}>
          {lemma.original} | {lemma.transliteration} | {lemma.translation}
          &nbsp;
          <IoIosOpen />
        </QueryNavLink>
      </div>
    )
  }
  
  const lemmata = getLemmataList();
  
  function updateCrossLink(event, id) {
    if (event.target.value) {
      let newLemma = getLemma(event.target.value);
      if (newLemma) {
        setCrossLink(event.target.value);
        setLemma(newLemma);
        props.updateCrossLink(event.target.value, id);
      }
    }
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
          data-tip="Add a link to another related lemma"
          data-for={"crossLink_"+i}
        >
          Linked Lemma
        </label>
        <ReactTooltip id={"crossLink_"+i} type="light" html={true} />
        <input 
          list="lemmata" 
          className={styles.inputWide}
          name={"crossLink_"+i}
          defaultValue={crossLink}
          onChange={event => updateCrossLink(event, i)}/>
        <datalist id="lemmata">
          {lemmata.map((lemma, j) => (
            <option
              key={j}
              label={lemma.original + ' | ' + lemma.transliteration + ' | ' + lemma.translation}
              data-id={lemma.lemmaId}
              value={lemma.lemmaId} 
            />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"crossLink_sample_"+i}
        >
          Sample Link
        </label>
        {lemma ? 
          <QueryNavLink className={styles.label} to={'/zodiac-routing/'+crossLink}>
            <>&nbsp;{lemma.original} | {lemma.transliteration} | {lemma.translation} <IoIosOpen /></>
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