import React from "react";

import styles from './Lemma.module.css';

function PublicLabelledText(props) {
  if (!props.content) {
		return null;
	}

	// content may be a React object (NewLineText), which may have an empty text prop
	if (props.content.props && !props.content.props.text) {
		return null;
	}

	return (
		<tr>
			<td>
				<div className={styles.label}>{props.label}</div>
			</td>
			<td>
				<div className={styles.label} style={props.style}>{props.content}</div>
			</td>
		</tr>
	);
}

export default PublicLabelledText;