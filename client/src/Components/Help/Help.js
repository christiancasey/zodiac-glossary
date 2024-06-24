import React from 'react';

import styles from './Help.module.css';

const Help = props => {
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <About />

        <br /><br />
        <HelpCopy />

        <br /><br />
        <br /><br />
        
      </div>
    </div>
  )
};

export default Help;

function About(props) {
  return (
    <>
      <h1>About the Zodiac Glossary</h1>

      <p>Welcome to the Zodiac Glossary, an integral component of the <a href="https://erc.europa.eu/" target="_blank" rel="noopener noreferrer">ERC grant-backed endeavor</a> known as <a href="https://www.geschkult.fu-berlin.de/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">ZODIAC – Ancient Astral Science in Transformation</a>. Our base of operations is situated within the <a href="https://www.fu-berlin.de/" target="_blank" rel="noopener noreferrer">Freie Universität Berlin</a>.</p>

      <h2>Our Purpose</h2>
      <p>Zodiac Glossary stands as a beacon of scholarly inquiry, dedicated to unraveling the complexities ingrained within ancient astral science. Our focus lies in meticulously curating and cross-referencing astral terms spanning diverse ancient languages – Akkadian, Aramaic, Egyptian, Greek, Hebrew, Latin, and Sanskrit. Our aim is to illuminate the intricate pathways through which zodiacal and other astral concepts were transmitted between ancient cultures.</p>

      <h2>The ZODIAC Project</h2>
      <p>Zodiac Glossary finds its place within the larger purview of <a href="https://www.geschkult.fu-berlin.de/e/zodiac/index.html">ZODIAC – Ancient Astral Science in Transformation</a>, an ERC grant-funded initiative hosted by the Freie Universität Berlin. The core essence of this endeavor resides in discerning concealed connections and evolutionary trajectories intrinsic to ancient astral science. By collaborating with luminaries in the fields of linguistics and history, we contribute to the ongoing exploration of humanity's abiding fascination with the cosmos and its enduring influence on civilizations past.</p>

      <h2>Methodology</h2>
      <p>Our approach is marked by meticulous compilation – a comprehensive repository that interweaves astral terms from diverse ancient languages. Through diligent documentation and intricate interlinking, we empower scholars, researchers, and enthusiasts to decipher intricate patterns, subtle differentiations, and revelations that offer a deeper insight into the tapestry of zodiacal and celestial constructs. Zodiac Glossary serves as a scholarly channel, facilitating nuanced exploration of intercultural dynamics and the convergence of celestial wisdom.</p>

      <h2>Join the Inquiry</h2>
      <p>We cordially invite you to join us in this journey of exploration. Delve into the enigmatic realm of ancient astral science, trace the linguistic currents that traverse civilizations, and uncover the profound resonance of ancient astral science. Through collective inquiry, we endeavor to unveil the enigmas intrinsic to our shared human heritage, revealing the indelible cosmic forces that have shaped our worldview.</p>

      <h2>Contact Information</h2>
      <p>For inquiries, collaborative opportunities, or contributions to our ongoing research, kindly reach out to us at <a href="mailto:christian.casey@fu-berlin.de">christian.casey@fu-berlin.de</a>. You are also welcome to <a href="https://zodiac.fly.dev/signup">signup as a contributor</a>. (NB all new users must be manually approved before gaining editor access.)</p>

      <h2>Some Important Notes</h2>
      <ul className={styles.stars}>
        <li>
          Ancient constellations may not (and probably don't) correspond to modern constellation names (e.g. as defined in the <a href="https://en.wikipedia.org/wiki/IAU_designated_constellations" target="_blank" rel="noopener noreferrer">IAU list of designated constellations</a>).
          Where constellation names are included in the lemmata, this is done to aid discovery.
          It should not be understood to mean that the modern name and the ancient one refer to precisely the same thing.
        </li>
        <li>
          Loan words may represent ad hoc instances of code switching.
          We don't specifically mark such cases, as it is difficult to determine whether a given word was established as a loan based on the limited evidence of surviving written sources.
        </li>
        <li>Sumerian loans into Akkadian are not marked. "Akkadian", as defined in the Glossary, should be understood to include Sumerian lexemes.</li>
      </ul>

      <h2>Open Data</h2>
      <p>
        <a href="https://github.com/christiancasey/zodiac-glossary/tree/main/backups/public">Archive versions of the dataset are periodically created and made available in the form of timestamped SQL Dumps</a>.
      </p>
    </>
  )
}

function HelpCopy(props) {
  return (
    <>
      <h1>Help</h1>
      <p>A place to find guidance on entering data for members of the <a href="https://www.geschkult.fu-berlin.de/en/e/zodiac/index.html" target="_blank" rel="noopener noreferrer">Zodiac Project</a>.</p>

      <h2>General Notes</h2>
      <ul className={styles.stars}>
        <li>
          Prefer British English spellings.
        </li>
        <li>
          You can add new issues at any time to the <a href="https://github.com/christiancasey/zodiac-glossary/issues" target="_blank" rel="noopener noreferrer">github issues page</a>.
        </li>
        <li>
          Don't forget to hover over labels in the app for specific help information!
        </li>
        <li>
          Scheduled maintenance time is 10.00–11.00 CET. Data entry may be affected by changes to the website during this time.
        </li>
        <li>
          Constellations are defined according to the <a href="https://en.wikipedia.org/wiki/IAU_designated_constellations" target="_blank" rel="noopener noreferrer">IAU list of designated constellations</a>. 
          Do not ascribe to ancient constellations modern designations except where certain.
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
          The normal form in Basic should also be included as a meaning and a variant.
        </li>
        <li>
          Meaning categories will eventually be selected with a dropdown. Right now you just have to type them in. Don't worry too much about consistency for now. I can fix them later.
        </li>
        <li>
          There are now fields for meaning category (e.g. zodiac sign) and variant comment (e.g. time period).
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
              Hunger, H. 2004. Stars, Cities, and Predictions. In: Studies in the History of the Exact Sciences in Honour of David Pingree, eds. Charles Burnett, Jan Hogendijk, Kim Plofker and Michio Yano. Leiden: Brill: 16–32.
            </li>
            <li>
              <span style={{fontWeight: 'bold'}}>Modern editions of ancient texts: </span><br />
              Geminus. 1898. Γεμίνου Εἰσαγωγή εἰς τὰ Φαινόμενα, Gemini Elementa Astronomiae, ed. C.H.A. Manitius. Leipzig: B.G. Teubner.
            </li>
          </ul>
        </li>
        <li>
          Note that there is also a Page Number field.
          Use this if the citation is from a specific page. 
          Continue to use page numbers in the Publication field when they delineate the entire article, etc.
        </li>
      </ul>
    </>
  )
}