import React from 'react';
import { Routes, Route } from "react-router-dom";

import styles from './Components/Content.module.css';

import StarHeader from './Components/StarHeader';
import Content from './Components/Content';
import Lemma from './Components/Lemma';

import GetDataTests from './Components/GetDataTests';   // for development


import UserContext from './Contexts/UserContext';


function App() {
  const [user, setUser] = React.useState({token: localStorage.getItem('token')});

  return (
    <div className="App">
      {/*<UserContext.Provider value={{
        user,
        setUser
      }}>*/}
        <StarHeader />
        <Content />
        {/*<Routes>
          <Route path="/zodiac-routing/" element={<Content />}>
            <Route className={styles.lemma} index element={<Lemma />} />
            <Route className={styles.lemma} path=":lemmaId" element={<Lemma />} />
          </Route>
        </Routes>*/}
      {/*</UserContext.Provider>*/}
      <div>
        <GetDataTests />
      </div>
    </div>
  );
}

export default App;
