import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import ExternalLink from './ExternalLink';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const ExternalLinks = props => {
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.crosslinks}>
      <h3>External Links</h3>
      {props.externalLinks.map((externalLink, i) => {
        return (
          <ExternalLink 
            key={externalLink.id} 
            externalLink={externalLink} 
            i={i} 
            updateExternalLink={props.updateExternalLink}
            deleteExternalLink={props.deleteExternalLink}
          />
        )
      })}
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={props.addNewExternalLink}><IoIosAddCircle /></button>
      </div>
      {user.token && (
      <>
        <h4>Dictionary Searches</h4>
        <ul>
          <li><a target="_blank" rel="noopener noreferrer" href="http://stephanus.tlg.uci.edu/Iris/inst/lexica.jsp">
            Thesaurus Linguae Graecae
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.perseus.tufts.edu/hopper/resolveform">
            Perseus Project
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="http://aaew2.bbaw.de/tla/servlet/BwlSearch?u=guest&f=0&l=0&db=1">
            Thesaurus Linguae Aegyptiae
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.dwl.aegyptologie.lmu.de/suche.php">
            Demotische Wortliste
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="http://129.206.5.162/beta/search/search.html">
            Demotic Palaeographical Database Project
          </a></li>
        </ul>
      </>
      )}
    </div>
  );
};

export default ExternalLinks;