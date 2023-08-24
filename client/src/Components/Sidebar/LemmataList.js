import React from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import {MdExpandMore, MdExpandLess} from 'react-icons/md';
import { IoIosAddCircle } from "react-icons/io";

import QueryNavLink from '../QueryNavLink'; // Replaced with button for the discard changes dialog – CDC 2023-05-16
import UserContext from '../../Contexts/UserContext';

import { getLemmataList } from '../../Data/api';
import { addNewLemma } from '../../Data/api';
import { searchLemma } from '../../Functions/searchLemmata';

import styles from './LemmataList.module.css';

const LemmataList = props => {
  const {user} = React.useContext(UserContext);
  const [lemmataFiltered, setLemmataFiltered] = React.useState([]);
  let [searchParams] = useSearchParams();
  let search = searchParams.get('search');
  let location = useLocation();
  let navigate = useNavigate();
  let currentLemmaId = +location.pathname.replace('/','');

  // const [lemmataList, setLemmataList] = React.useState([]); 
  // Moved up to content to be shared with cross links
  const lemmataList = props.lemmataList;
  const setLemmataList = props.setLemmataList;
  
  const [lemmataSortField, setLemmataSortField] = React.useState('transliteration');
  
  // Forces a refresh of the list when a new lemma is added (and on load)
  // Uses a dummy lemma variable in content to detect saves and update the list
  // Plus location because that changes when a new lemma is added
  React.useEffect(() => {
    getLemmataList(setLemmataList, user && user.token);
  }, [props.contentLemma, location, user]);

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

  // Replaces the old NavLink method
  // Allows for a confirm dialog to avoid discarding changes to open lemma
  const navigateToLemma = (e, to) => {
    e.preventDefault();

    // Don't do anything if the user clicks the link to the lemma that is currently open
    if (currentLemmaId === to) {
      return;
    }

    // Check whether there are unsaved changes and confirm with user before leaving lemma
    if (props.changed) {
      const discardChanges = window.confirm(`Current lemma has not been saved.\nDo you want to leave this page and discard changes?`);

      if (discardChanges) {
        navigate('/' + to + location.search);
      }
    } else {
      navigate('/' + to + location.search);
    }
    
  };

  function addNewLemmaButton() {
    addNewLemma(props.setSelectedLemmaId, user.token);
    props.setChanged(true);
  };
  
  return (
    <>
      <h2>Lemmata</h2>

      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.addNewLemma} onClick={e => addNewLemmaButton()}>
          <IoIosAddCircle /> Add new lemma...
        </button>
      </div>

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
            className={({isActive}) => (isActive ? styles.lemmaListEntryActive : styles.lemmaListEntry)}
            key={lemma.lemmaId}
            to={lemma.lemmaId}
            onClick={e => navigateToLemma(e, lemma.lemmaId)}
          >
            <LemmataListItem lemma={lemma} />
          </QueryNavLink>
      ))}
    </>
  );
};

const LemmataListItem = props => {
  const lemma = props.lemma;
  return (
    <div className={styles.lemmataListItem}>
      {!lemma.published && (<span style={{fontStyle: 'italic'}}> – {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}</span>)}
      {lemma.published && (<>{lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}</>)}
      &nbsp;&nbsp;
      {lemma.meanings.length > 0 &&
        <Collapsible 
          trigger={<MdExpandMore />}
          triggerWhenOpen={<MdExpandLess />}
          contentContainerTagName="span"
          transitionTime={200}
        >
          <ul>
            {lemma.meanings.map((meaning, key) => {
              if (lemma.published) {
                return (<li key={key}>{meaning.value}{meaning.category ? ' (' + meaning.category + ')' : ''}</li>);
              } else {
                return (<li key={key} style={{fontStyle: 'italic'}}>{meaning.value}{meaning.category ? ' (' + meaning.category + ')' : ''}</li>);
              }
            })}
          </ul>
        </Collapsible>
      }
    </div>
  )
};

export default LemmataList;