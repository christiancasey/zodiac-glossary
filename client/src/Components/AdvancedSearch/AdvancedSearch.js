import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchResults from "./AdvancedSearchResults";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";

// import UserContext from '../../Contexts/UserContext';

const AdvancedSearch = props => {
  // const {user} = React.useContext(UserContext);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Advanced Search</h1>
        <AdvancedSearchBuilder />
        <AdvancedSearchResults />
      </div>
    </div>
  )
};

export default AdvancedSearch;