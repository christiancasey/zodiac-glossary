import React from 'react';
// import { Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Sidebar from './Sidebar';

import styles from './Content.module.css';

const Content = props => {
  
  let [sidebarUpdate, setSidebarUpdate] = React.useState(uuidv4());
  let [changed, setChanged] = React.useState(false);
  
  // Really stupid cludge that forces the sidebar to update when the user saves a new lemma
  // It's either this or raise all of the lemma state and redo the routing just for that one edge case
  // -CDC 2022-08-15
  const updateLemmataList = () => {
    setSidebarUpdate(uuidv4());
  };
  
  
  return (
    <section style={{height: '80vh'}}>
    {/* <div className={styles.content}> */}
      <Sidebar sidebarUpdate={sidebarUpdate} setChanged={setChanged} />
      {/* <Outlet context={[updateLemmataList, changed, setChanged]} /> */}
    {/* </div> */}
    </section>
  );
};

export default Content;