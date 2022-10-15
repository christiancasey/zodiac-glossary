import React from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import { getLemma, getLemmataList } from "../Data/sample-data";

import QueryNavLink from './QueryNavLink';
import UserContext from '../Contexts/UserContext';

import styles from './Lemma.module.css';

const CrossLink = props => {
  const {user} = React.useContext(UserContext);
  const [crosslink, setCrosslink] = React.useState(props.crosslink);
  const [lemma, setLemma] = React.useState(getLemma(props.crosslink));
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  // Needed to make sure the crosslinks update when the user follows a crosslink to a new lemma
  React.useEffect(() => {
    setCrosslink(props.crosslink);
    setLemma(getLemma(props.crosslink));
  }, [props.crosslink, crosslink]);
  
  if (!user.token) {
    if (!lemma || !lemma.published)
      return <></>;
    
    return (
      <div className={styles.label}>
        <QueryNavLink to={'/zodiac-routing/'+crosslink}>
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
        setCrosslink(event.target.value);
        setLemma(newLemma);
        props.updateCrossLink(event.target.value, id);
      }
    }
  }
  
  return (
    <div 
      className={styles.crosslinksList}
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
          htmlFor={"crosslink_"+i}
          data-tip="Add a link to another related lemma"
          data-for={"crosslink_"+i}
        >
          Linked Lemma
        </label>
        <ReactTooltip id={"crosslink_"+i} type="light" html={true} />
        <input 
          list="lemmata" 
          className={styles.inputWide}
          name={"crosslink_"+i}
          defaultValue={crosslink}
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
          htmlFor={"crosslink_sample_"+i}
        >
          Sample Link
        </label>
        {lemma ? 
          <QueryNavLink className={styles.label} to={'/zodiac-routing/'+crosslink}>
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