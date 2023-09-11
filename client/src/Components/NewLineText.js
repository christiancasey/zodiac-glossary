import React from "react";

function NewlineText(props) {
  const text = props.text;
  const newText = text.split('\n').map((str, key) => <p key={key}>{str}</p>);
  
  return newText;
}

export default NewlineText;