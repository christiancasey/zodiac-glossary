import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchTermInput from "./AdvancedSearchTermInput";

import { searchFieldTypes } from '../../Data/options';
import { IoIosTrash } from "react-icons/io";

const AdvancedSearchEntry = props => {

  return (
    <tr>
      <td>
        <button className={styles.delete} onClick={e => props.deleteSearchTerm(props.termNumber)}><IoIosTrash /></button>
      </td>
      <td>
        <select 
          className={styles.input} 
          name="search_field" 
          id="search_field" 
          value={props.field} 
          onChange={e => props.onFieldChange(e, props.termNumber)}
        >
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
        <AdvancedSearchTermInput
          termNumber={props.termNumber}
          placeholder="search term"
          field={props.field}
          term={props.term}
          onTermChange={props.onTermChange}
        />
      </td>
    </tr>
  );
};

export default AdvancedSearchEntry;