export function getContributions(token = '') {
  let url = '/api/contributors';

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
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
}