import React from "react";

function NewlineText(props) {
  const text = props.text;

  // Needed for the PublicLabelledText component to not appear when the field is empty
  if (!text) {
    return null;
  }

  const newText = text.split('\n').map((str, key) => <p key={key} style={props.style}>{str}</p>);
  return newText;
}

export default NewlineText;