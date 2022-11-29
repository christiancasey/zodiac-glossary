// Replaces sample-data.js as the new way to work with the dataset in the production website
// For now every part is in here to keep things simple
// Different areas of the api are divided by comment headings


////////////////////////////////////////////////////////////////////////////////
// LEMMATA LIST
////////////////////////////////////////////////////////////////////////////////

export function getLemmataList(setLemmataList, token = null) {
  let url = '/api/lemmata/list';
  const params = new URLSearchParams({token});
  url += '?' + params.toString();
  
  fetch(url)
  .then(res => res.json())
  .then(data => setLemmataList(data));
}

export function addNewLemma(setNewLemmaId, token = null) {
  let url = '/api/lemmata/add';
  const params = new URLSearchParams({token});
  url += '?' + params.toString();

  fetch(url)
  .then(res => res.json())
  .then(data => setNewLemmaId(data));
}

////////////////////////////////////////////////////////////////////////////////
// LEMMA
////////////////////////////////////////////////////////////////////////////////

export function getLemmaDB(setLemma, lemmaId) {
  let url = '/api/lemma/get';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();
  
  fetch(url)
  .then(res => res.json())
  .then(data => setLemma(data));
}