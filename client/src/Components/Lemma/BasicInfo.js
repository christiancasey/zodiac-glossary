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

  // If the editor field is blank, put in the username
  if (!lemma.editor || !lemma.editor.trim()) {
    lemma.editor = (user.user ? user.user.username : '');
  }
  
  return (
    <div className={user.token ? styles.basic : styles.basicPublic}>
      <h3>Basic</h3>
      <table><tbody>
        {/* <tr>
          <td><label className={styles.label} htmlFor="lemmaId">Lemma ID</label></td>
          <td><input className={styles.input} type="text" name="lemmaId" placeholder="0" value={lemma.lemmaId} onChange={(onChange)} disabled={true} /></td>
        </tr> */}
        {/* comment out the above when routing is finished */}

        {user.token && (
        <tr>
        <td>
            <label
              className={styles.label}
              htmlFor="editor"
              data-tip="Put your name here<br />any time you edit a lemma."
              data-for="editor-tooltip"
            >
              Editor
            </label>
            <ReactTooltip id="editor-tooltip" type="light" html={true} />
          </td>
          <td>
            <input
              className={styles.input}
              type="text"
              id="editor"
              name="editor"
              placeholder="editor"
              value={lemma.editor}
              onChange={onChange}
            />
          </td>
        </tr>)}

        <tr style={{display: (user.token ? 'table-row' : 'none')}}>
          <td>
            <label
              className={styles.label}
              htmlFor="published"
              data-tip="If checked, this lemma will be visible to all site visitors."
              data-for="published-tooltip"
            >
              Published
            </label>
            <ReactTooltip id="published-tooltip" type="light" html={true} />
          </td>
          <td>
            <input
              type="checkbox"
              name="published"
              id="published"
              checked={lemma.published}
              onChange={onChange}
            />
          </td>
        </tr>
        <tr style={{display: (user.token ? 'table-row' : 'none')}}>
          <td>
            <label
              className={styles.label}
              htmlFor="attention"
              data-tip="Lemma contains errors."
              data-for="attention-tooltip"
            >
              Attention
            </label>
            <ReactTooltip id="attention-tooltip" type="light" html={true} />
          </td>
          <td>
            <input
              type="checkbox"
              name="attention"
              id="attention"
              checked={lemma.attention}
              onChange={onChange}
            />
          </td>
        </tr>
        <tr style={{display: (user.token ? 'table-row' : 'none')}}>
          <td>
            <label
              className={styles.label}
              htmlFor="checked"
              data-tip="Lemma has been checked by a 2nd editor."
              data-for="checked-tooltip"
            >
              Checked
            </label>
            <ReactTooltip id="checked-tooltip" type="light" html={true} />
          </td>
          <td>
            <input
              type="checkbox"
              name="checked"
              id="checked"
              checked={lemma.checked}
              onChange={onChange}
            />
          </td>
        </tr>
        <Dropdown
          name="language"
          label="Language"
          value={lemma.language}
          options={languageOptions}
          onChange={onChange} 
        />
        <Dropdown
          name="partOfSpeech"
          label="Part of Speech"
          value={lemma.partOfSpeech}
          options={partOfSpeechOptions}
          onChange={onChange} 
        />
        <tr>
          <td>
            <label
              className={styles.label}
              htmlFor="transliteration"
              data-tip="Akkadian: (normalized) transcription<br />Egyptian: Egyptological transliteration<br />Other: Roman transliteration"
              data-for="phonetic-tooltip"
            >
              {lemma.language === "akkadian" ? 'Normalized' : 'Transliteration'}
            </label>
            <ReactTooltip id="phonetic-tooltip" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              style={{fontStyle: (lemma.language === "akkadian" || 'italic')}}
              type="text"
              name="transliteration"
              id="transliteration"
              placeholder="transliteration"
              value={lemma.transliteration}
              onChange={onChange}
            />)}
            {!user.token && (<div style={{fontStyle: 'italic'}}>{lemma.transliteration}</div>)}
          </td>
        </tr>
        {lemma.language === "akkadian" && (<tr>
          <td>
            <label className={styles.label} htmlFor="literal_translation2">
              Literal Translation
            </label>
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="literal_translation2"
              id="literal_translation2"
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
              data-for="original-tooltip"
            >
              {lemma.language === "akkadian" ? 'Transliteration' : 'Original'}
            </label>
            <ReactTooltip id="original-tooltip" type="light" html={true} />
          </td>
          <td>
            {user.token && (<input
              className={styles.input}
              type="text"
              name="original"
              id="original"
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
              id="translation"
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
              id="primary_meaning"
              placeholder="primary meaning"
              value={lemma.primary_meaning}
              onChange={onChange}
            />)}
            {!user.token && (<div>{lemma.primary_meaning}</div>)}
          </td>
        </tr>
        {user.token && (<tr>
          <td>
            <label className={styles.label} htmlFor="comment">
              Internal Comment
            </label>
          </td>
          <td>
            <textarea
              className={styles.inputComment}
              type="text"
              name="comment"
              id="comment"
              placeholder="comment"
              value={lemma.comment}
              onChange={onChange}
            ></textarea>
          </td>
        </tr>)}
      </tbody></table>
    </div>
  );
};

export default BasicInfo;