// Replaces sample-data.js as the new way to work with the dataset in the production website
// For now every part is in here to keep things simple
// Different areas of the api are divided by comment headings


////////////////////////////////////////////////////////////////////////////////
// LEMMATA LIST
////////////////////////////////////////////////////////////////////////////////

// Change token default to null after adding authentication
export function getLemmataList(setLemmataList, token = true) {
  let url = '/api/lemmata/list';
  const params = new URLSearchParams({token});
  url += '?' + params.toString();
  
  fetch(url)
  .then(res => res.json())
  .then(data => setLemmataList(data));
}

export function addNewLemma(setNewLemmaId, token = true) {
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

  // Skip the fetch process if the lemmaId is missing
  console.log(lemmaId);
  if (!lemmaId) {
    console.log('skip querying lemma');
    setLemma();
    return;
  }

  let url = '/api/lemma/get';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();
  
  fetch(url)
  .then(response => {
    // Make sure that the lemmaId is valid, or set lemma to undefined
    // Needed to prevent panic in Lemma and subparts when the id is invalid
    if (response.ok) {
      return response.json();
    } else {
      setLemma();
    }
  })
  .then(data => setLemma(data))
  .catch(error => {
    setLemma();
    console.error(error);
  });
}

export function saveLemmaToDB(setLemma, lemma) {
  let url = '/api/lemma/save';

  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PATCH",
    body: JSON.stringify(lemma),
  })
  .then(res => res.json())
  .then(data => setLemma(data))
  .catch(data => console.log(data)); // Add error handling that will show the lemma as unsaved if the operation fails
}

export function deleteLemmaFromDB(lemmaId) {
  let url = '/api/lemma/delete';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();

  fetch(url, {
    method: "DELETE",
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(data => console.log(data));
}