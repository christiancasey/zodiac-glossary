import React from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import QueryNavLink from '../QueryNavLink';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';



const CrossLink = props => {
  const lemmata = props.lemmataList;
  const i = props.i;
  const {user} = React.useContext(UserContext);
  const [crossLink, setCrossLink] = React.useState(props.crossLink);
  const [lemma, setLemma] = React.useState(getLemmaById(lemmata, props.crossLink));
  // const [lemmata, setLemmata] = React.useState([]);
  
  const [style, setStyle] = React.useState({display: 'none'});

  function getLemmaById(lemmataList, id) {
    return lemmataList.find(lemma => lemma.lemmaId === parseInt(id));
  }
  
  // Needed to make sure the crossLinks update when the user follows a crossLink to a new lemma
  React.useEffect(() => {
    setCrossLink(props.crossLink);
    setLemma(getLemmaById(lemmata, props.crossLink));
  }, [props.crossLink, crossLink]);
  
  if (!user.token) {
    if (!lemma || !lemma.published)
      return <></>;
    
    return (
      <div className={styles.label}>
        <QueryNavLink to={'/'+crossLink}>
          {lemma.original} | {lemma.transliteration} | {lemma.translation}
          &nbsp;
          <IoIosOpen />
        </QueryNavLink>
      </div>
    )
  }
  
  function updateCrossLink(event, id) {
    if (event.target.value) {
      props.updateCrossLink(event.target.value, id);
      setCrossLink(event.target.value);
      setLemma(getLemmaById(lemmata, event.target.value));
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
          list="lemmata_list" 
          className={styles.inputWide}
          name={"crossLink_"+i}
          defaultValue={crossLink}
          onChange={event => updateCrossLink(event, i)}/>
        <datalist id="lemmata_list">
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
          <QueryNavLink className={styles.label} to={'/'+crossLink}>
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