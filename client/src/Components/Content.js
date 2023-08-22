import React from 'react';
import { Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { getLemmataList } from '../Data/api';
import { getMeaningCategories } from "../Data/autocomplete";

import Sidebar from './Sidebar/Sidebar';
import UserContext from '../Contexts/UserContext';

import styles from './Content.module.css';

const Content = props => {
  
  let [sidebarUpdate, setSidebarUpdate] = React.useState(uuidv4());
  let [changed, setChanged] = React.useState(false);
  let [contentLemma, setContentLemma] = React.useState();
  let [lemmataList, setLemmataList] = React.useState([]);
  const {user} = React.useContext(UserContext);

  // Autocomplete data
  let [meaningsCategories, setMeaningsCategories] = React.useState([]);

  React.useEffect(() => {
    getLemmataList(setLemmataList, user.token);
    getMeaningCategories(setMeaningsCategories);
  }, []);
  
  // Really stupid cludge that forces the sidebar to update when the user saves a new lemma
  // It's either this or raise all of the lemma state and redo the routing just for that one edge case
  // -CDC 2022-08-15
  // No longer works, probably because of async nature of DB save fn.
  // Replaced with contentLemma dummy var
  // –CDC 2022-11-30
  const updateLemmataList = () => {
    setSidebarUpdate(uuidv4());
  };
  
  return (
    // <section style={{height: '80vh'}}>
    <div className={styles.content}>
      <Sidebar sidebarUpdate={sidebarUpdate} changed={changed} setChanged={setChanged} contentLemma={contentLemma} lemmataList={lemmataList} setLemmataList={setLemmataList} />
      <Outlet context={[updateLemmataList, changed, setChanged, setContentLemma, lemmataList, meaningsCategories]} />
    </div>
    // </section>
  );
};

export default Content;