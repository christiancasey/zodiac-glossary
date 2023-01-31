
// Flesh this out to make search softer
// DONE ~~e.g. ignore case, Greek accents, diff between ỉ/j/i~~
// What else?

const replacements = [
  // Had to delete this one because it matches too many things in languages besides Egy
  // {
  //   original: /[ỉjy]/g,
  //   replacement: 'i'
  // },
  {
    original: /[᾽ι᾿῀῁῍῎῏῝῞῟῭΅`´῾]/g,
    replacement: ''
  },
  {
    original: /[ῤῥῬ]/g,
    replacement: 'ρ'
  },
  {
    original: /[ς]/g,
    replacement: 'σ'
  },
]

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
  softString = softString.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  
  for (let i = 0; i < replacements.length; i++) {
    softString = softString.replace(replacements[i].original, replacements[i].replacement);
  }
  
  softString = leadingSpace + softString; // Replace the leading space if necessary
  
  return softString;
}

export function searchLemma(lemma, search) {
  let match = false;
  
  search = softenString(search);

  match = match || softenString(lemma.original).includes(search);
  match = match || softenString(lemma.transliteration).toLowerCase().includes(search);
  match = match || softenString(lemma.translation).includes(search);
  match = match || softenString(lemma.primary_meaning).includes(search);
  match = match || softenString(lemma.literal_translation2).includes(search);
  
  for (let meaning of lemma.meanings) {
    match = match || softenString(meaning.value).includes(search);
  }

  return match;
}

