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
        {/* <tr>
          <td><label className={styles.label} htmlFor="lemmaId">Lemma ID</label></td>
          <td><input className={styles.input} type="text" name="lemmaId" placeholder="0" value={lemma.lemmaId} onChange={(onChange)} disabled={true} /></td>
        </tr> */}
        {/* comment out the above when routing is finished */}

        {/* Temporary: Editor field. Delete after user authentication is ready */}
        <tr>
        <td>
            <label
              className={styles.label}
              htmlFor="editor"
              data-tip="Put your name here any time you edit a lemma."
              data-for="editor"
            >
              Editor
            </label>
            <ReactTooltip id="editor" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="editor"
              placeholder="editor"
              value={lemma.editor}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.editor}</div>)}
          </td>
        </tr>
        {/* Temporary: Delete when user authentication is working */}

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
          // options={[{id: 0, value: ''}, ...languageOptions]} // Old way of adding a blank space
          options={languageOptions}
          onChange={onChange} 
        />
        <Dropdown
          name="partOfSpeech"
          label="Part of Speech"
          value={lemma.partOfSpeech}
          // options={[{id: 0, value: ''}, ...partOfSpeechOptions]} // Old way of adding a blank space
          options={partOfSpeechOptions}
          onChange={onChange} 
        />
        <tr>
          <td>
            <label
              className={styles.label}
              htmlFor="transliteration"
              data-tip="Akkadian: (normalized) transcription<br />Egyptian: Egyptological transliteration<br />Other: Roman transliteration"
              data-for="phonetic"
            >
              {lemma.language === "akkadian" ? 'Normalized' : 'Transliteration'}
            </label>
            <ReactTooltip id="phonetic" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              style={{fontStyle: (lemma.language === "akkadian" || 'italic')}}
              type="text"
              name="transliteration"
              placeholder="transliteration"
              value={lemma.transliteration}
              onChange={onChange}
            />)}
            {!user.token && (<div style={{fontStyle: 'italic'}}>{lemma.transliteration}</div>)}
          </td>
        </tr>
        {lemma.language === "akkadian" && (<tr>
          <td>
            <label className={styles.label} htmlFor="translation">
              Literal Translation
            </label>
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="literal_translation2"
              placeholder="literal translation"
              value={lemma.literal_translation2}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.literal_translation2}</div>)}
          </td>
        </tr>)}
        <tr>
          <td>
            <label
              className={styles.label}
              htmlFor="original"
              data-tip="Akkadian: transliteration<br />Egyptian: hieroglyphic<br />Other: original text (Unicode)"
              data-for="original"
            >
              {lemma.language === "akkadian" ? 'Transliteration' : 'Original'}
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
            <label className={styles.label} htmlFor="translation">
              Literal Translation
            </label>
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="translation"
              placeholder="literal translation"
              value={lemma.translation}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.translation}</div>)}
          </td>
        </tr>
        <tr>
          <td>
            <label className={styles.label} htmlFor="primary_meaning">
              Primary Meaning
            </label>
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="primary_meaning"
              placeholder="primary meaning"
              value={lemma.primary_meaning}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.primary_meaning}</div>)}
          </td>
        </tr>
      </tbody></table>
    </div>
  );
};

export default BasicInfo;