import React from 'react';
import { Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Sidebar from './Sidebar';

import styles from './Content.module.css';

const Content = props => {
  
  let [sidebarUpdate, setSidebarUpdate] = React.useState(uuidv4());
  let [changed, setChanged] = React.useState(false);
  let [contentLemma, setContentLemma] = React.useState();
  
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
    <section style={{height: '80vh'}}>
    <div className={styles.content}>
      <Sidebar sidebarUpdate={sidebarUpdate} setChanged={setChanged} contentLemma={contentLemma} />
      <Outlet context={[updateLemmataList, changed, setChanged, setContentLemma]} />
    </div>
    </section>
  );
};

export default Content;