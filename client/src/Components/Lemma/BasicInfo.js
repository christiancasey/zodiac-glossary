import React from 'react';
import ReactTooltip from 'react-tooltip';

import Dropdown from '../Dropdown';
import UserContext from '../../Contexts/UserContext';

import { languageOptions, partOfSpeechOptions } from '../../Data/options';

import styles from './Lemma.module.css';

const BasicInfo = props => {
  let lemma = props.lemma;
  let onChange = props.onChange;
  const {user} = React.useContext(UserContext);
  
  return (
    <div className={styles.basic}>
      <h3>Basic</h3>
      <table><tbody>
        <tr>
          <td><label className={styles.label} htmlFor="lemmaId">Lemma ID</label></td>
          <td><input className={styles.input} type="text" name="lemmaId" placeholder="0" value={lemma.lemmaId} onChange={(onChange)} disabled={true} /></td>
        </tr>
        {/* comment out the above when routing is finished */}
        <tr style={{display: (user.token ? 'table-row' : 'none')}}>
          <td>
            <label
              className={styles.label}
              htmlFor="published"
              data-tip="If checked, this lemma will be visible to all site visitors."
              data-for="published"
            >
              Published
            </label>
            <ReactTooltip id="published" type="light" html={true} />
          </td>
          <td>
            <input
              type="checkbox"
              name="published"
              checked={lemma.published}
              onChange={onChange}
            />
          </td>
        </tr>
        <Dropdown
          name="language"
          label="Language"
          value={lemma.language}
          options={[{id: 0, value: ''}, ...languageOptions]}
          onChange={onChange} 
        />
        <Dropdown
          name="partOfSpeech"
          label="Part of Speech"
          value={lemma.partOfSpeech}
          options={[{id: 0, value: ''}, ...partOfSpeechOptions]}
          onChange={onChange} 
        />
        <tr>
          <td>
            <label
              className={styles.label}
              htmlFor="original"
              data-tip="Akkadian: transliteration<br />Egyptian: hieroglyphic<br />Other: original text (Unicode)"
              data-for="original"
            >
              Dictionary Form
            </label>
            <ReactTooltip id="original" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="original"
              placeholder="original"
              value={lemma.original}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.original}</div>)}
          </td>
        </tr>
        <tr>
          <td>
            <label
              className={styles.label}
              htmlFor="transliteration"
              data-tip="Akkadian: (normalized) transcription<br />Egyptian: Egyptological transliteration<br />Other: Roman transliteration"
              data-for="phonetic"
            >
              Transliteration
            </label>
            <ReactTooltip id="phonetic" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.inputTransliteration}
              type="text"
              name="transliteration"
              placeholder="transliteration"
              value={lemma.transliteration}
              onChange={onChange}
            />)}
            {!user.token && (<div style={{fontStyle: 'italic'}}>{lemma.transliteration}</div>)}
            </td>
        </tr>
        <tr>
          <td><label className={styles.label} htmlFor="translation">Translation</label></td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="translation"
              placeholder="translation"
              value={lemma.translation}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.translation}</div>)}
          </td>
        </tr>
      </tbody></table>
    </div>
  );
};

export default BasicInfo;