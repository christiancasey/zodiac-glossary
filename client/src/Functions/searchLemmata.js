
const replacements = [  
  // Had to delete this one because it matches too many things in languages besides Egy
  // {
  //   original: /[ỉjy]/g,
  //   replacement: 'i',
  // },
  {
    //eslint-disable-next-line
    original: /[\-–—]/g,
    replacement: '',
  },
  {
    original: /[᾽ι᾿῀῁῍῎῏῝῞῟῭΅`´῾]/g,
    replacement: '',
  },
  {
    original: /[ῤῥῬ]/g,
    replacement: 'ρ',
  },
  {
    original: /[ς]/g,
    replacement: 'σ',
  },
  {
    original: /[ₓ]/g,
    replacement: 'x',
  },
  {
    original: /[₀]/g,
    replacement: '0',
  },
  {
    original: /[₁]/g,
    replacement: '1',
  },
  {
    original: /[₂]/g,
    replacement: '2',
  },
  {
    original: /[₃]/g,
    replacement: '3',
  },
  {
    original: /[₄]/g,
    replacement: '4',
  },
  {
    original: /[₅]/g,
    replacement: '5',
  },
  {
    original: /[₆]/g,
    replacement: '6',
  },
  {
    original: /[₇]/g,
    replacement: '7',
  },
  {
    original: /[₈]/g,
    replacement: '8',
  },
  {
    original: /[₉]/g,
    replacement: '9',
  },
];

const softenString = string => {
  
  // Prevent stupid error if string is undefined
  if (!string) {
    return '';
  }

  let softString = string.slice();
  
  // Keep leading spaces in search for matching things like "Month I" with searches like " I"
  let leadingSpace = (softString.charAt(0) === ' ' ? ' ' : '');

  softString = softString.trim();
  softString = softString.toLowerCase();
  softString = softString.normalize('NFD');

  // Can't remember why I put this here, but it removes combining diacrtics
  // I've commented it out because it matches š to s – CDC 2023-08-22
  // softString = softString.replace(/[\u0300-\u036f]/g, ""); 
  
  for (let i = 0; i < replacements.length; i++) {
    softString = softString.replace(replacements[i].original, replacements[i].replacement);
  }
  
  softString = leadingSpace + softString; // Replace the leading space if necessary
  
  return softString;
};

export function searchLemma(lemma, search) {
  let match = false;

  search = softenString(search);

  // Secret feature, allows to filter by editor – CDC 2023-02-08
  match = match || softenString('editor:' + lemma.editor).includes(search);

  match = match || softenString(lemma.original).includes(search);
  match = match || softenString(lemma.transliteration).toLowerCase().includes(search);
  match = match || softenString(lemma.translation).includes(search);
  match = match || softenString(lemma.primary_meaning).includes(search);
  match = match || softenString(lemma.literal_translation2).includes(search);
  
  for (let meaning of lemma.meanings) {
    match = match || softenString(meaning.value).includes(search);
    match = match || softenString(meaning.category).includes(search);
  }

  return match;
}

