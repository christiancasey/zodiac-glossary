export const languageOptions = [
  { id: 0, value: 'none',     label: '' },
  { id: 1, value: 'akkadian', label: 'Akkadian' },
  { id: 2, value: 'aramaic',  label: 'Aramaic' },
  { id: 3, value: 'egyptian', label: 'Egyptian' },
  { id: 4, value: 'greek',    label: 'Greek' },
  { id: 5, value: 'hebrew',   label: 'Hebrew' },
  { id: 6, value: 'latin',    label: 'Latin' },
  { id: 7, value: 'sanskrit', label: 'Sanskrit' },
];

export const partOfSpeechOptions = [
  { id: 0,  value: 'none',          label: '' },
  { id: 1,  value: 'adjective',     label: 'Adjective'},
  { id: 2,  value: 'adverb',        label: 'Adverb'},
  { id: 3,  value: 'article',       label: 'Article'},
  { id: 4,  value: 'conjunction',   label: 'Conjunction'},
  { id: 5,  value: 'interjection',  label: 'Interjection'},
  { id: 6,  value: 'noun',          label: 'Noun'},
  { id: 7,  value: 'particle',      label: 'Particle'},
  { id: 8,  value: 'preposition',   label: 'Preposition'},
  { id: 9,  value: 'pronoun',       label: 'Pronoun'},
  { id: 10, value: 'verb',          label: 'Verb'},
  { id: 11, value: 'unknown',       label: '❌ Unknown'},
];

export const loanTypes = [
  { id: 0, value: 'none',   label: '' },
  { id: 1, value: 'loan',   label: 'Loan word' },
  { id: 2, value: 'calque', label: 'Calque (literal translation)' },
  { id: 3, value: 'quote',  label: 'Code switching (quote)' },
];

// List of variables labeled by name, needed for advanced search
export const optionLists = [
  { name: 'languageOptions',      object: languageOptions, },
  { name: 'partOfSpeechOptions',  object: partOfSpeechOptions, },
  { name: 'loanTypes',            object: loanTypes, },
];

export const searchFieldTypes = [
  { id: 0,  table: 'lemmata',   value: 'none',              label: '',                    inputType: '',                                          },
  { id: 1,  table: 'lemmata',   value: 'editor',            label: 'Editor',              inputType: 'text',                                      },
  { id: 2,  table: 'lemmata',   value: 'language_id',       label: 'Language',            inputType: 'dropdown',  objectName: 'languageOptions',      },
  { id: 3,  table: 'lemmata',   value: 'partofspeech_id',   label: 'Part of Speech',      inputType: 'dropdown',  objectName: 'partOfSpeechOptions',  },
  { id: 4,  table: 'lemmata',   value: 'transliteration',   label: 'Transliteration',     inputType: 'text',                                      },
  { id: 5,  table: 'lemmata',   value: 'original',          label: 'Original Text',       inputType: 'text',                                      },
  { id: 6,  table: 'lemmata',   value: 'translation',       label: 'Literal Translation', inputType: 'text',                                      },
  { id: 7,  table: 'lemmata',   value: 'primary_meaning',   label: 'Primary Meaning',     inputType: 'text',                                      },
  { id: 8,  table: 'lemmata',   value: 'loan_language_id',  label: 'Source Language',     inputType: 'dropdown',  objectName: 'languageOptions',      },
  // { id: 9,  table: 'lemmata',   value: 'loan_type',         label: 'Type of Loan',        inputType: 'dropdown',  objectName: 'loanTypes'             },
  { id: 10, table: 'meanings',  value: 'value',             label: 'Meaning',             inputType: 'text',                                      },
  { id: 11, table: 'meanings',  value: 'category',          label: 'Category',            inputType: 'text',                                      },
];
