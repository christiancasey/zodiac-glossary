import React from "react";

import LanguageItem from "./LanguageItem";

const LanguageList = props => {
  return (
    <>
      <h2>Languages</h2>
      {/* <ol className="language-list">
        {props.languages.map(language => {
          return (
            <LanguageItem 
              key={language.id}
              language={language}
              selectLanguage={props.selectLanguage}
            />
          );
        })}
      </ol> */}
    </>
  );
};

export default LanguageList;