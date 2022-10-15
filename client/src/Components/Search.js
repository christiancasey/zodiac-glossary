import React from "react";
import { BsKeyboardFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

import Keyboards from './Keyboards';

import styles from './Lemma.module.css';

const Search = props => {
  let [searchParams, setSearchParams] = useSearchParams();
  let [keyboardVisible, setKeyboardVisible] = React.useState(false);
  let [search, setSearch] = React.useState(searchParams.get('search') || '');
  
  function addSearchParam(newSearch) {
    setSearch(newSearch);
    let newSearchParams = Object.fromEntries([...searchParams]);
    newSearchParams.search = (newSearch ? newSearch : '');
    setSearchParams(newSearchParams);
  }
  
  const keyboardClick = e => {
    setKeyboardVisible(prevKeyboardVisible => !prevKeyboardVisible)
  };
  
  const keyClick = key => {
    let newSearch = search;
    if (key === 'delete') {
      // Array conversion needed to deal with two-byte Unicode characters
      // setSearch(prevSearch => Array.from(prevSearch).slice(0, -1).join(''));
      newSearch = Array.from(newSearch).slice(0, -1).join('');
    } else {
      // setSearch(prevSearch => prevSearch + key);
      newSearch = newSearch + key;
    }
    addSearchParam(newSearch);
  }
  
  return (
    <>
      <h2>Search</h2>
      <input
        className={styles.inputSearch}
        type="text"
        placeholder="lemma..."
        value={search}
        onChange={event => addSearchParam(event.target.value)}
      />
      <button
        className={styles.searchKeyboard}
        onClick={() => keyboardClick()}
      >
        <BsKeyboardFill />
      </button>
      <div className={keyboardVisible ? styles.fadeIn : styles.fadeOut }>
        <Keyboards visible={keyboardVisible} keyboardClick={keyboardClick} keyClick={keyClick} />
      </div>
    </>
  );
};

export default Search;