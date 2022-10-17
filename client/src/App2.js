import React from 'react';
import { Routes, Route } from "react-router-dom";

import styles from './Components/Content.module.css';

import StarHeader from './Components/StarHeader';
import Content from './Components/Content';
import Lemma from './Components/Lemma';

import GetDataTests from './Components/GetDataTests';   // for development


import UserContext from './Contexts/UserContext';


function App2() {
  const [user, setUser] = React.useState({token: localStorage.getItem('token')});

  return (
    <div className="App">
      App
      <div>
        <GetDataTests />
      </div>
    </div>
  );
}

export default App2;
