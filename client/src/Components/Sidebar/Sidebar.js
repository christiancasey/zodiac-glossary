import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import Search from './Search';
import LanguageList from './LanguageList';
import LemmataList from './LemmataList';

import { languageOptions } from '../../Data/options';

import styles from '../Lemma.module.css';

const Sidebar = props => {
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  let location = useLocation();
  const [languages, setLanguages] = React.useState(getLanguageList(languageOptions));
  const [selectedLemmaId, setSelectedLemmaId] = React.useState(null);
  
  // // Force language list to update on location change
  // // Needed to keep the values current when some action strips away the query string
  React.useEffect(() => {
    setLanguages(getLanguageList(languageOptions));
  }, [location]);

  // Used when adding a new lemma ONLY
  // The sub-component LemmataList actually uses QueryNavLink to achieve this same result
  // because using <a> or <button> with props.setSelectedLemmaId() would require restyling and other problems
  React.useEffect(() => {
    navigate(selectedLemmaId + location.search, { replace: true });
  }, [selectedLemmaId]);
  
  // Get language list from search params
  // Language is active by default if the language is not yet defined in the query string
  // because new visitors will begin with an empty query string but should start with all languages active
  function getLanguageList(languageOptions) {
    let languages = languageOptions.map(language => {
      let active = searchParams.get(language.value);
      if (active) {
        active = active==='true';
      } else {
        active = true; // Default if not defined
      }
      return {
        id: language.id,
        value: language.value,
        label: language.label,
        active: active,
      }
    });
    return languages;
  };
  
  function selectAllLanguages(selectAll) {
    let newLanguages = languages.map(language => {
      language.active = selectAll;
      return language;
    });
    setLanguages(newLanguages);

    // Add language values to search params while keeping existing search value
    let newSearchParams = Object.fromEntries([...searchParams]);
    for (const language of newLanguages) {
      if (language.value !== 'none') {
        newSearchParams[language.value] = language.active;
      }
    }
    setSearchParams(newSearchParams);
  }

  function selectLanguage(id) {
    let newLanguages = languages.map(language => {
      if (language.id === id)
        return {
          ...language,
          active: !language.active,
        };
      return language;
    });
    setLanguages(newLanguages);
    
    // Add language values to search params while keeping existing search value
    let newSearchParams = Object.fromEntries([...searchParams]);
    for (const language of newLanguages) {
      if (language.value !== 'none') {
        newSearchParams[language.value] = language.active;
      }
    }
    setSearchParams(newSearchParams);
    
  }
  
  return (
    <nav className={styles.sidebar}>
      <Search />
      <LanguageList languages={languages} selectLanguage={selectLanguage} selectAllLanguages={selectAllLanguages} />
      <LemmataList languages={languages} setSelectedLemmaId={setSelectedLemmaId} contentLemma={props.contentLemma} lemmataList={props.lemmataList} setLemmataList={props.setLemmataList} changed={props.changed} setChanged={props.setChanged} />
    </nav>
  );
};

export default Sidebar;