import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Collapsible from "react-collapsible";
import {MdExpandMore, MdExpandLess} from 'react-icons/md';

import QueryNavLink from '../QueryNavLink';
import UserContext from '../../Contexts/UserContext';

import { getLemmataList } from '../../Data/api';
import { searchLemma } from '../../Functions/searchLemmata';

import styles from '../Lemma.module.css';

const LemmataList = props => {
  const {user} = React.useContext(UserContext);
  const [lemmataFiltered, setLemmataFiltered] = React.useState([]);
  let [searchParams] = useSearchParams();
  let search = searchParams.get('search');
  let location = useLocation();


  // const [lemmataList, setLemmataList] = React.useState([]); 
  // Moved up to content to be shared with cross links
  const lemmataList = props.lemmataList;
  const setLemmataList = props.setLemmataList;
  
  const [lemmataSortField, setLemmataSortField] = React.useState('primary_meaning');
  
  // Forces a refresh of the list when a new lemma is added (and on load)
  // Uses a dummy lemma variable in content to detect saves and update the list
  // Plus location because that changes when a new lemma is added
  React.useEffect(() => {
    getLemmataList(setLemmataList, user && user.token);
  }, [props.contentLemma, location]);

  React.useEffect(() => {

    // Filter the lemmata list using both the search term and the selected languages
    let tempLemmataFiltered = [];
    tempLemmataFiltered = lemmataList;

    if (search) {
      tempLemmataFiltered = tempLemmataFiltered
        .filter(lemma => {
          if (!search) return true;
          return searchLemma(lemma, search);
        });
    }
    if (props.languages.length) {
      tempLemmataFiltered = tempLemmataFiltered
        .filter(lemma => 
          props.languages.some(language => (
              language.active 
              && language.value === lemma.language
            )
          )
          || !lemma.language
        );
    }

    // Use the field set with the 'Sort by' buttons to sort
    tempLemmataFiltered.sort((a, b) => 
      (a[lemmataSortField].toLowerCase() < b[lemmataSortField].toLowerCase() ? -1 : 1)
    );

    setLemmataFiltered(tempLemmataFiltered);

  }, [lemmataList, search, lemmataSortField, props.languages]);
  
  return (
    <>
      <h2>Lemmata</h2>
      <div className={styles.sortButtons}>
        Sort by: 
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('transliteration')}>Transliteration</button> |
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('original')}>Original</button> |
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('primary_meaning')}>Meaning</button>
          {/* Breaks formatting and language is not displayed in this list, so results are confusing */}
          {/* | <button className={styles.sortButtons} onClick={e => setLemmataSortField('language')}>Language</button> */}
      </div>

      {lemmataFiltered
        .map(lemma => (
          <QueryNavLink 
            className={styles.lemmaListEntry} 
            style={({ isActive }) => {
                return { display: "block", margin: "1rem 0", filter: isActive ? "drop-shadow(0 0 2px #ffe6)" : ""};
              }}
            to={lemma.lemmaId} 
            key={lemma.lemmaId}
          >
            <LemmataListItem lemma={lemma} />
            <Collapsible 
              trigger={<MdExpandMore />}
              triggerWhenOpen={<MdExpandLess />}
              contentContainerTagName="span"
              transitionTime={200}
            >
              <ul>
                {lemma.meanings.map((meaning, key) => {
                  if (lemma.published) {
                    return (<li key={key}>{meaning}</li>);
                  } else {
                    return (<li key={key} style={{fontStyle: 'italic', color: '#ffea'}}>{meaning}</li>);
                  }
                })}
              </ul>
            </Collapsible>
          </QueryNavLink>
      ))}
    </>
  );
};

const LemmataListItem = props => {
  const lemma = props.lemma;
  return (
    <>
      {!lemma.published && (<span style={{fontStyle: 'italic', color: '#ffea'}}> – {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}</span>)}
      {lemma.published && (<>{lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}</>)}
      &nbsp;&nbsp;
    </>
  )
};

export default LemmataList;