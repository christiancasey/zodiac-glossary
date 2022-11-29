import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";

import QueryNavLink from './QueryNavLink';
import UserContext from '../Contexts/UserContext';

import { getLemmataList } from '../Data/api';
import { searchLemma } from '../Functions/searchLemmata';

import styles from './Lemma/Lemma.module.css';

const LemmataList = props => {
  const {user} = React.useContext(UserContext);
  const [lemmataList, setLemmataList] = React.useState([]);
  const [lemmataFiltered, setLemmataFiltered] = React.useState([]);
  let [searchParams] = useSearchParams();
  let search = searchParams.get('search');
  let location = useLocation();
  
  const [lemmataSortField, setLemmataSortField] = React.useState('original');
  
  // Forces a refresh of the list when a new lemma is added (and on load)
  React.useEffect(() => {
    // Pass state setting functions as callbacks to api functions
    // Allows the separation of really long and cumbersome fetch calls from app code
    // I'm not sure whether this is the "right" way to do it, but it makes sense to me
    // CDC 2022-11-08
    getLemmataList(setLemmataList, user && user.token);
  }, [location]);

  React.useEffect(() => {
    
    // Why is this necessary? CDC 2022-11-08
    // Seems to work without this even when the lemmata list returned from server is empty
    // if (!Array.isArray(lemmataList))
    //   return;
    
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
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('original')}>Dictionary</button> |
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('transliteration')}>Transliteration</button> |
          <button className={styles.sortButtons} onClick={e => setLemmataSortField('translation')}>Translation</button>
          {/* A nice idea, but breaks sorting above because language can be null, but sorting needs to use the .toLowerCase() function
            <button className={styles.sortButtons} onClick={e => setLemmataSortField('language')}>Language</button> */}
      </div>

      {lemmataFiltered
        .map(lemma => (
          <QueryNavLink 
            className={styles.lemmaListEntry} 
            style={({ isActive }) => {
                return { display: "block", margin: "1rem 0", filter: isActive ? "drop-shadow(0 0 2px #ffe6)" : ""};
              }}
            to={lemma.lemmaid} 
            key={lemma.lemmaid}
          >
            {!lemma.published && (<div style={{fontStyle: 'italic', color: '#ffea'}}> – {lemma.original} | {lemma.transliteration} | {lemma.translation}</div>)}
            {lemma.published && (<>{lemma.original} | {lemma.transliteration} | {lemma.translation}</>)}
          </QueryNavLink>
      ))}
    </>
  );
};

export default LemmataList;