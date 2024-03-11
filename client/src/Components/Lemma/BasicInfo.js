import React from 'react';
import ReactTooltip from 'react-tooltip';

import Dropdown from '../Dropdown';
import PublicLabelledText from "../PublicLabelledText";
import UserContext from '../../Contexts/UserContext';

import { languageOptions, partOfSpeechOptions, loanTypes } from '../../Data/options';

import styles from './Lemma.module.css';

const BasicInfo = props => {
  let lemma = props.lemma;
  let onChange = props.onChange;
  const {user} = React.useContext(UserContext);

  // Public view
  if (!user.token) {
    return (
      <div className={styles.basicPublic}>
        <h3>Basic</h3>
        <table><tbody>
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
          <PublicLabelledText
            label={lemma.language === "akkadian" ? 'Normalized' : 'Transliteration'}
            content={lemma.transliteration}
            style={{fontStyle: 'italic'}}
          />
          {lemma.language === "akkadian" && (
            <PublicLabelledText label={'Literal Translation'} content={lemma.literal_translation2} />
          )}
          <PublicLabelledText label={lemma.language === "akkadian" ? 'Transliteration' : 'Original'} content={lemma.original} />
          <PublicLabelledText label={'Literal Translation'} content={lemma.translation} />
          <PublicLabelledText label={'Primary Meaning'} content={lemma.primary_meaning} />
          {(lemma.loan_language === "none") ||
          (<>
          <Dropdown
            name="loan_language"
            label="Source Language"
            value={lemma.loan_language}
            options={languageOptions}
            onChange={onChange} 
          />
          <Dropdown
            name="loan_type"
            label="Type of Loan"
            value={lemma.loan_type}
            options={loanTypes}
            onChange={onChange} 
          />
          </>)}
        </tbody></table>
      </div>
    );
  }

  // If the editor field is blank, put in the username
  if (!lemma.editor || !lemma.editor.trim()) {
    lemma.editor = (user.user ? user.user.username : '');
  }
  
  // Editor view
  return (
    <div className={styles.basic}>
      <h3>Basic</h3>
      <table><tbody>
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
        </tr>

        <tr>
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
        <tr>
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
        <tr>
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
            <input
              className={styles.input}
              style={{fontStyle: (lemma.language === "akkadian" || 'italic')}}
              type="text"
              name="transliteration"
              id="transliteration"
              placeholder="transliteration"
              value={lemma.transliteration}
              onChange={onChange}
            />
          </td>
        </tr>
        {lemma.language === "akkadian" && (<tr>
          <td>
            <label className={styles.label} htmlFor="literal_translation2">
              Literal Translation
            </label>
          </td>
          <td>
            <input
              className={styles.input}
              type="text"
              name="literal_translation2"
              id="literal_translation2"
              placeholder="literal translation"
              value={lemma.literal_translation2}
              onChange={onChange}
            />
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
            <input
              className={styles.input}
              type="text"
              name="original"
              id="original"
              placeholder="original"
              value={lemma.original}
              onChange={onChange}
            />
          </td>
        </tr>
        <tr>
          <td>
            <label className={styles.label} htmlFor="translation">
              Literal Translation
            </label>
          </td>
          <td>
            <input
              className={styles.input}
              type="text"
              name="translation"
              id="translation"
              placeholder="literal translation"
              value={lemma.translation}
              onChange={onChange}
            />
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
          </td>
        </tr>
        <Dropdown
          name="loan_language"
          label="Source Language"
          value={lemma.loan_language}
          options={languageOptions}
          onChange={onChange} 
        />
        <Dropdown
          name="loan_type"
          label="Type of Loan"
          value={lemma.loan_type}
          options={loanTypes}
          onChange={onChange} 
        />
        {/* Do we really need this? Ask about it in glossary meeting on 09.02.2024 */}
        {/* <tr>
          <td>
            <label 
              className={styles.label} 
              htmlFor="dropdown_loan_type"
              data-tip="What sort of loan? Normal"
              data-for="type-of-loan-tooltip"
            >
              Type of Loan
            </label>
            <ReactTooltip id="type-of-loan-tooltip" type="light" html={true} />
          </td>
          <td>
            <select className={styles.input} name="loan_type" id={"dropdown_loan_type"} value={lemma.loan_type} onChange={onChange}>
              {loanTypes.map(option => {
                // Create an empty default for new data
                if (!option.value)
                  return (
                    <option disabled key={option.id} value={option.value}>{option.label}</option>
                  );
                return (
                  <option key={option.id} value={option.value}>{option.label}</option>
                );
              })}
            </select>
          </td>
        </tr> */}
        <tr>
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
        </tr>
      </tbody></table>
    </div>
  );
};

export default BasicInfo;