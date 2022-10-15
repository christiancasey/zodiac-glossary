import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";

import Search from './Search';
import LanguageList from './LanguageList';
import LemmataList from './LemmataList';
import UserContext from '../Contexts/UserContext';

import { languageOptions } from '../Data/options';
import { addNewLemma } from '../Data/sample-data';

import styles from './Lemma.module.css';

const Sidebar = props => {
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  let location = useLocation();
  const [languages, setLanguages] = React.useState(getLanguageList(languageOptions));
  const {user} = React.useContext(UserContext);
  
  // Force language list to update on location change
  // Needed to keep the values current when some action strips away the query string
  React.useEffect(() => {
    setLanguages(getLanguageList(languageOptions))
  }, [location])
  
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
  
  function selectLanguage(id) {
    let newLanguages = languages.map(language => {
      if (language.id === id)
        return {
          ...language,
          active: !language.active,
        };
      return language;
    });
    
    // Add language values to search params while keeping existing search value
    let newSearchParams = Object.fromEntries([...searchParams]);
    for (const language of newLanguages) {
      newSearchParams[language.value] = language.active;
    }
    setSearchParams(newSearchParams);
    
    setLanguages(newLanguages);
  }
  
  function addNewLemmaButton() {
    let newLemmaId = addNewLemma();
    props.setChanged(true);
    navigate(newLemmaId + location.search, { replace: true });
  }
  
  return (
    <nav className={styles.sidebar}>
      <Search />
      <LanguageList languages={languages} selectLanguage={selectLanguage} />
      <LemmataList languages={languages} />
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.addNewLemma} onClick={e => addNewLemmaButton()}><IoIosAddCircle /> Add new lemma...</button>
      </div>
    </nav>
  );
};

export default Sidebar;