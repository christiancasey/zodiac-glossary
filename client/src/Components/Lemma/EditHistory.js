import React from "react";

import { getEditHistory } from "../../Data/api";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const EditHistory = props => {
  const lemma = props.lemma;
  const [edits, setEdits] = React.useState([]);
  const {user} = React.useContext(UserContext);

  const [showAll, setShowAll] = React.useState(false);

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
        if (!showAll && i >= 5) {
          return;
        }

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
      {showAll || edits.length <= 5 || <button className={styles.sortButtons} onClick={e => setShowAll(true)}>Show all...</button>}
    </div>
  );
};

export default EditHistory;