import React from 'react';

import UserContext from '../Contexts/UserContext';

import styles from './Lemma.module.css';

const Dropdown = ({ name, label, value, options, onChange }) => {
  const {user} = React.useContext(UserContext);
  
  // A bit convoluted, but functions to display value as plain text when no user is logged in
  // As the label itself is not passed to the component, it must be found from the options list using the value
  if (!user.token) {
    return (
      <tr>
        <td>
          <label className={styles.label} htmlFor={"dropdown_"+label}>{label}</label>
        </td>
        <td>
          <div>{options.filter(option => option.value === value)[0].label}</div>
        </td>
      </tr>
    );
  }
  
  return (
    <tr>
      <td>
        <label className={styles.label} htmlFor={"dropdown_"+label}>{label}</label>
      </td>
      <td>
        <select className={styles.input} name={name} value={value} onChange={onChange}>
          {options.map(option => {
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
    </tr>
  );
};

export default Dropdown;