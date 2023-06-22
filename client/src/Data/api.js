// Replaces sample-data.js as the new way to work with the dataset in the production website
// For now every part is in here to keep things simple
// Different areas of the api are divided by comment headings


////////////////////////////////////////////////////////////////////////////////
// LEMMATA LIST
////////////////////////////////////////////////////////////////////////////////

// Change token default to null after adding authentication
export function getLemmataList(setLemmataList, token = '') {
  let url = '/api/lemmata/list';
  const params = new URLSearchParams({token});
  url += '?' + params.toString();
  
  fetch(url)
  .then(response => response.json())
  .then(data => data.map(lemma => {
    lemma.last_edit = new Date(lemma.last_edit);
    return lemma;
  }))
  .then(data => setLemmataList(data));
}

// Streamlines the use of state functions in components
export function getLemmataListPromise(token = '') {
  let url = '/api/lemmata/list';
  const params = new URLSearchParams({token});
  url += '?' + params.toString();

  return new Promise((resolve, reject) => {

    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      method: "GET",
    })
    .then(response => response.json())
    .then(data => data.map(lemma => {
      lemma.last_edit = new Date(lemma.last_edit);
      return lemma;
    }))
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
}

export function addNewLemma(setNewLemmaId, token = '') {
  let url = '/api/lemmata/add';

  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    method: "GET",
  })
  .then(response => response.json())
  .then(data => setNewLemmaId(data));
}

////////////////////////////////////////////////////////////////////////////////
// LEMMA
////////////////////////////////////////////////////////////////////////////////

export function getLemmaFromDB(setLemma, lemmaId) {

  // Skip the fetch process if the lemmaId is missing
  if (!lemmaId) {
    setLemma();
    return;
  }

  let url = '/api/lemma/get';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();
  
  fetch(url)
  .then(response => {
    // Make sure that the lemmaId is valid, or set lemma to undefined
    // Needed to prevent panic in Lemma subparts when the id is invalid
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

export function saveLemmaToDB(setLemma, lemma, token = '') {
  let url = '/api/lemma/save';

  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    method: "PATCH",
    body: JSON.stringify(lemma),
  })
  .then(response => response.json())
  .then(data => setLemma(data))
  .catch(data => {
    console.log(data);
    setLemma({});
  }); // Add error handling that will show the lemma as unsaved if the operation fails
}

export function deleteLemmaFromDB(lemmaId, token = '') {
  let url = '/api/lemma/delete';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();

  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    method: "DELETE",
  })
  .then(response => response.json())
  .catch(data => console.log(data));
}

export function checkLemma(lemmaId, checked = false, field = "checked", token = '') {
  // console.log('checkLemma()', lemmaId, checked);
  
  let url = '/api/lemma/check';
  
  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    method: "PATCH",
    body: JSON.stringify({lemmaId, checked, field}),
  })
  .then(response => response.json())
  .catch(data => console.error(data)); // Add error handling that will show the lemma as unsaved if the operation fails
}

export function getEditHistory(lemmaId, token = '') {
  let url = '/api/lemma/history';
  const params = new URLSearchParams({lemmaId});
  url += '?' + params.toString();

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      method: "GET",
    })
    .then(response => response.json())
    .then(data => data.map(edit => {
      edit.timestamp = new Date(edit.timestamp);
      return edit;
    }))
    .then(data => resolve(data))
    .catch(error => reject(error));
  })
}

// React.useEffect(() => {
//   getLemmataListPromise(user.token)
//   .then(lemmata => setLemmata(lemmata))
//   .catch(error => console.error(error));
// }, []);

// // Streamlines the use of state functions in components
// export function getLemmataListPromise(token = '') {
//   let url = '/api/lemmata/list';
//   const params = new URLSearchParams({token});
//   url += '?' + params.toString();

//   return new Promise((resolve, reject) => {

//     fetch(url, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token,
//       },
//       method: "GET",
//     })
//     .then(response => response.json())
//     .then(data => data.map(lemma => {
//       lemma.last_edit = new Date(lemma.last_edit);
//       return lemma;
//     }))
//     .then(data => resolve(data))
//     .catch(error => reject(error));
//   });
// }