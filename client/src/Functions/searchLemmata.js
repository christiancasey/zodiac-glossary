
// Flesh this out to make search softer
// DONE ~~e.g. ignore case, Greek accents, diff between ỉ/j/i~~
// What else?

const replacements = [
  {
    original: /[ỉjy]/g,
    replacement: 'i'
  },
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
  let softString = string.slice();
  
  softString = softString.trim();
  softString = softString.toLowerCase();
  softString = softString.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  
  for (let i = 0; i < replacements.length; i++) {
    softString = softString.replace(replacements[i].original, replacements[i].replacement);
  }
  
  return softString;
}

export function searchLemmata(lemmata, search) {
  let lemmataFiltered = lemmata;

  lemmataFiltered = lemmata.filter(lemma => {
    let match = false;

    search = softenString(search);

    match = match || softenString(lemma.original).includes(search);
    match = match || softenString(lemma.transliteration).includes(search);
    match = match || softenString(lemma.translation).includes(search);

    return match;
  });

  return lemmataFiltered;
};

export function searchLemma(lemma, search) {
  let match = false;
  
  search = softenString(search);

  match = match || softenString(lemma.original).includes(search);
  match = match || softenString(lemma.transliteration).toLowerCase().includes(search);
  match = match || softenString(lemma.translation).includes(search);
  
  return match;
}

