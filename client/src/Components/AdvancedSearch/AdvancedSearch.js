import React from 'react';

import styles from './AdvancedSearch.module.css';

import { IoIosAddCircle, IoIosTrash } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import Dropdown from '../Dropdown';

import { searchFieldTypes } from '../../Data/options';

const AdvancedSearchEntry = props => {

  const onChange = e => {
    props.onChange(e);
  };

  return (
    <tr>
      {/* <td>{props.termNumber}</td> */}
      <td>
        <button className={styles.delete} onClick={e => props.deleteSearchTerm(props.termNumber)}><IoIosTrash /></button>
      </td>
      <td>
        <select className={styles.input} name="search_field" id="search_field" value={props.type} onChange={onChange}>
          {searchFieldTypes.map(option => {
            // Create an empty default for new data
            if (!option.value)
              return (
                <option disabled key={option.id} value={option.value}>{option.label}</option>
              );
            return (
              <option key={option.id} value={option.value}>{option.label}</option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          className={styles.inputWide}
          type="text"
          id={props.termNumber}
          name="editor"
          placeholder="search term"
          value={props.term}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}

const searchTermsInitial = [
  { termNumber: 1, type: 'editor', term: '' },
  { termNumber: 2, type: 'language', term: '' },
  { termNumber: 3, type: 'partOfSpeech', term: '' },
];

const AdvancedSearchInput = props => {

  let [searchTerms, setSearchTerms] = React.useState(searchTermsInitial);

  const onChange = e => {
    console.log(e);
  };

  const addNewSearchTerm = e => {
    setSearchTerms(prevSearchTerms => {
      return [
        ...prevSearchTerms,
        { termNumber: Math.max(...prevSearchTerms.map(term=>term.termNumber))+1, type: 'none', term: '' }
      ];
    })
  };

  const deleteSearchTerm = termNumber => {
    console.log('Delete term: ' + termNumber)

    setSearchTerms(prevSearchTerms => {
      return prevSearchTerms.filter(term => term.termNumber != termNumber);
    })
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
              type={term.type}
              term={term.term}
              onChange={onChange}
              deleteSearchTerm={deleteSearchTerm}
            />
          );
        })}
        <tr><td>
        <button className={styles.add} onClick={addNewSearchTerm}><IoIosAddCircle /></button>
        </td></tr>
      </tbody></table>
    </>
  )
};

const AdvancedSearchResults = props => {

  return (
    <>
      <h2>Results</h2>
      <ol>
        <li>Results will go here...</li>
      </ol>
    </>
  )
}

const AdvancedSearch = props => {
  const {user} = React.useContext(UserContext);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Advanced Search</h1>
        <AdvancedSearchInput />
        <AdvancedSearchResults />
      </div>
    </div>
  )
}
export default AdvancedSearch;