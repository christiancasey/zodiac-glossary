import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import ExternalLink from './ExternalLink';
import UserContext from '../../Contexts/UserContext';

import { unicodeGreek2BetaCode } from "../../Functions/unicodeGreek2BetaCode";

import styles from './Lemma.module.css';

const ExternalLinks = props => {
  const {user} = React.useContext(UserContext);

  const original = props.lemma.original;
  const transliteration = props.lemma.transliteration;

  unicodeGreek2BetaCode(original)
  
  return (
    <div className={styles.crossLinks}>
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
          <li><a target="_blank" rel="noopener noreferrer" href="http://oracc.museum.upenn.edu/adsd/corpus">
            ORACC
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="http://stephanus.tlg.uci.edu/Iris/inst/lexica.jsp">
            Thesaurus Linguae Graecae
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={"https://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=&lang=greek"}>
            Perseus Project—Greek
          </a></li>
          {/* <li><a target="_blank" rel="noopener noreferrer" href={"http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=" + original + "&lang=la"}>
            Perseus Project—Latin
          </a></li> */}
          <li><a target="_blank" rel="noopener noreferrer" href={"https://www.perseus.tufts.edu/hopper/morph?l=" + original + "&la=la"}>
            Perseus Project—Latin
          </a></li>
          {/* <li><a target="_blank" rel="noopener noreferrer" href="http://aaew2.bbaw.de/tla/servlet/BwlSearch?u=guest&f=0&l=0&db=1">
            Thesaurus Linguae Aegyptiae (Old)
          </a></li> */}
          {/* <li><a target="_blank" rel="noopener noreferrer" href="https://thesaurus-linguae-aegyptiae.de/search">
            Thesaurus Linguae Aegyptiae (New)
          </a></li> */}
          <li><a target="_blank" rel="noopener noreferrer" href={"https://thesaurus-linguae-aegyptiae.de/search/lemma?script=hieratic&_script=on&_script=on&transcription.text=" + transliteration + "&transcription.enc=unicode&wordClass.type=excl_names&root=&translation.text=&translation.lang=en&bibliography="}>
            Thesaurus Linguae Aegyptiae
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.dwl.aegyptologie.lmu.de/suche.php">
            Demotische Wortliste
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="http://129.206.5.162/beta/search/search.html">
            Demotic Palaeographical Database Project
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={"https://coptic-dictionary.org/results.cgi?coptic=" + original + "&dialect=any&pos=any&definition=&def_search_type=exact+sequence&lang=any"}>
            Coptic Dictionary Online
          </a></li>
        </ul>
      </>
      )}
    </div>
  );
};

export default ExternalLinks;