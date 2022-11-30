import React from "react";

import LanguageItem from "./LanguageItem";

const LanguageList = props => {

  // Filter out the "none" language value
  // This is needed for initilizing new lemmata but should not be a selection option
  let languages = props.languages.filter(language => language.value !== "none");

  return (
    <>
      <h2>Languages</h2>
      <ol className="language-list">
        {languages.map(language => {
          return (
            <LanguageItem 
              key={language.id}
              language={language}
              selectLanguage={props.selectLanguage}
            />
          );
        })}
      </ol>
    </>
  );
};

export default LanguageList;