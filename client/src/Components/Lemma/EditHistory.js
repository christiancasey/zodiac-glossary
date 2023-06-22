import React from "react";

import { getEditHistory } from "../../Data/api";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const EditHistory = props => {
  const lemma = props.lemma;
  const [edits, setEdits] = React.useState([]);
  const {user} = React.useContext(UserContext);
  

  React.useEffect(() => {
    if (user.token) {
      getEditHistory(lemma.lemmaId, user.token)
      .then(edits => setEdits(edits))
      .catch(error => console.error(error));
    }
  }, [lemma]);

  if (!user.token || !lemma) {
    return <></>;
  }

  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  // .toLocaleDateString("en-US", dateFormat)
  return (
    <div className={styles.crossLinks}>
      <h3>Edit History</h3>
      <table><tbody>
      {edits.map((edit, i) => {
        return (
          <tr key={edit.id}>
            <td>
              {edits.length-i}
            </td>
            <td>
              {edit.username}
            </td>
            <td>
              {edit.timestamp.toLocaleDateString("en-US", dateFormat)}
            </td>
          </tr>
        )
      })}
      </tbody></table>

      {/* {props.externalLinks.map((externalLink, i) => {
        return (
          <ExternalLink 
            key={externalLink.id} 
            externalLink={externalLink} 
            i={i} 
            updateExternalLink={props.updateExternalLink}
            deleteExternalLink={props.deleteExternalLink}
          />
        )
      })} */}
    </div>
  );
};

export default EditHistory;