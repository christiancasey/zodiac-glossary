import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchEntry from "./AdvancedSearchEntry";

import { IoIosAddCircle } from "react-icons/io";

const searchTermsInitial = [
  { termNumber: 1, field: 'editor',          term: '', inputType: 'text', },
  { termNumber: 2, field: 'language_id',     term: '', inputType: 'dropdown', },
  { termNumber: 3, field: 'partofspeech_id', term: '', inputType: 'dropdown', },
];

const AdvancedSearchBuilder = props => {

  let [searchTerms, setSearchTerms] = React.useState(JSON.parse(JSON.stringify(searchTermsInitial)));

  const onFieldChange = (e, termNumber) => {
    setSearchTerms(prevSearchTerms =>
      prevSearchTerms.map(searchTerm => {
        if (searchTerm.termNumber === termNumber) {
          searchTerm.field = e.target.value;
          searchTerm.term = '';
          return searchTerm
        }
        return searchTerm;
      })
    );
  };

  const onTermChange = (termNumber, newTerm, newInputType) => {
    setSearchTerms(prevSearchTerms =>
      prevSearchTerms.map(searchTerm => {
        if (searchTerm.termNumber === termNumber) {
          searchTerm.term = newTerm;
          searchTerm.inputType = newInputType;
          return searchTerm;
        }
        return searchTerm;
      })
    );
  };

  const addNewSearchTerm = e => {
    setSearchTerms(prevSearchTerms => {
      return [
        ...prevSearchTerms,
        { termNumber: Math.max(...prevSearchTerms.map(term=>term.termNumber))+1, field: 'none', term: '' }
      ];
    })
  };

  const deleteSearchTerm = termNumber => {
    console.log('Delete term: ' + termNumber)

    setSearchTerms(prevSearchTerms => {
      return prevSearchTerms.filter(term => term.termNumber !== termNumber);
    })
  };

  // UPDATE WEBSITE FIRST THING WEDNESDAY OR THURSDAY
  const runAdvancedSearch = e => {
    console.log(searchTerms)
  };

  const resetSearch = e => {
    setSearchTerms(JSON.parse(JSON.stringify(searchTermsInitial)));
  };

  return (
    <>
      <h2>Build a search</h2>
      <table><tbody>
        { searchTerms.map((term, termIndex) => {
          return (
            <AdvancedSearchEntry
              key={term.termNumber}
              termNumber={term.termNumber}
              field={term.field}
              term={term.term}
              onFieldChange={onFieldChange}
              onTermChange={onTermChange}
              deleteSearchTerm={deleteSearchTerm}
            />
          );
        })}
        <tr><td>
        <button className={styles.add} onClick={addNewSearchTerm}><IoIosAddCircle /></button>
        </td></tr>
      </tbody></table>

      <button onClick={e => runAdvancedSearch(e)}>Search</button>
      <button onClick={e => resetSearch(e)}>Reset</button>
    </>
  )
};

export default AdvancedSearchBuilder;