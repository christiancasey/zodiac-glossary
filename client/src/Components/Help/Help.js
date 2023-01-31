import React from 'react';

import styles from './Help.module.css';

import { getTodoList } from "../../Data/todo";

const Help = props => {

  const [todoList, setTodoList] = React.useState([]);

  React.useEffect(() => {
    getTodoList(setTodoList);
  }, []);


  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Help</h1>
        <p>A place to find guidance on entering data for members of the <a href="https://www.geschkult.fu-berlin.de/en/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">Zodiac Project</a>.</p>

        <ul>
        <h2>General Notes</h2>
          <li>
            You can add new issues at any time to the <a href="https://github.com/christiancasey/zodiac-glossary/issues" target="_blank" rel="noopener noreferrer">github issues page</a>.
          </li>
          <li>
            Don't forget to hover over labels in the app for specific help information!
          </li>
          <li>
            Scheduled maintenance time is 10.00–11.00 CET. Data entry may be affected by changes to the website during this time.
          </li>
        
        <h2>Lemmata</h2>
          <li>
            Different words for the same concept (in English) are different lemmata.
            E.g. the German words "Mal" and "Zeit" can both be translated into English as "time", but they are still two separate lemmata in a glossary.
            We wouldn't group them together simply because they happen to have a common English equivalent.
            Divide lemmata according to original meaning, not English translation.
          </li>
          <li>
            When two lemmata are related in some way, use a Cross Link to connect them.
          </li>
        
        <h2>Basic Info</h2>
          <li>
            Please add your name to the Editor box in the Basic panel.
            (This helps to track and troubleshoot errors as they occur.)
          </li>
          <li>
            Note that there are now two fields in Basic for the English part of a lemma: 
            Literal Translation and Primary Meaning.
            The Literal Translation is the exact meaning of the word or phrase translated directly to English.
            The Primary Meaning is the meaning by which people should be expected to find the lemma.
            E.g. "noble lady" might be the literal translation of the Egyptian word, but it's primary meaning is "Virgo", because people will most often be looking for the Egyptian word for Virgo, not noble lady.
          </li>

        <h2>Meanings and Variants</h2>
          <li>
            There are now fields for meaning category (e.g. zodiac sign) and variant comment (e.g. time period).
          </li>
          <li>
            Meaning categories will eventually be selected with a dropdown. Right now you just have to type them in. Don't worry too much about consistency for now. I can fix them later.
          </li>

        <h2>Quotations</h2>
          <li>
            Use as much context for the quotation as seems appropriate. More context is generally better, but in some cases (e.g. lists) it only makes sense to quote the word itself.
          </li>
          {/* <li>
            Please use <a href="https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-1.html" target="_blank" rel="noopener noreferrer">Chicago Manual of Style</a> citation style for Publication.
            You may omit elements of the citation or modify it as you wish, but please be consistent so that the citations look nice.
          </li> */}
          <li>
            We have established a stylesheet for citations in the Publication field.
            <ul>
              <li>
                <span style={{fontWeight: 'bold'}}>Journals: </span><br />
                Rochberg, F., 1987. TCL 6 13: Mixed Traditions in Late Babylonian Astrology, Zeitschrift für Assyriologie 77: 207-228.
              </li>
              <li>
                <span style={{fontWeight: 'bold'}}>Monographs: </span><br />
                Ossendrijver, M., 2012. Babylonian Mathematical Astronomy: Procedure Texts. New York: Springer.
              </li>
              <li>
                <span style={{fontWeight: 'bold'}}>Edited Volumes: </span><br />
                Hunger, H. 2004. Stars, Cities, and Predictions. In: Studies in the History of the Exact Sciences in Honour of David Pingree, eds. Charles Burnett, Jan Hogendijk, Kim Plofker and Michio Yano. Leiden: Brill: 16–32
              </li>
            </ul>
          </li>
          <li>
            Note that there is also a Page Number field.
            Use this if the citation is from a specific page. 
            Continue to use page numbers in the Publication field when they delineate the entire article, etc.
          </li>
        </ul>

        <br /><br />
        <h1>Todo</h1>
        <p>I've put a todo list here for myself and so that everyone can see what's still pending.</p>
        <ul>
          {todoList.map(todo => (
            <li className={(todo.complete && styles.done)}> {todo.item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default Help;