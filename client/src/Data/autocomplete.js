export function getMeaningCategories(setMeaningsCategories) {
  let url = '/api/autocomplete/meanings';
  fetch(url)
  .then(res => res.json())
  .then(data => setMeaningsCategories(data));
}

export function getQuotationFields(setQuotationFields, field) {
  let url = '/api/autocomplete/quotations?field=' + field;
  fetch(url)
  .then(res => res.json())
  .then(data => setQuotationFields(data));
}

export function getQuotationFromSource(setQuotationFromSource, source) {
  let url = '/api/autocomplete/quotation_from_source';
  const params = new URLSearchParams({source});
  url += '?' + params.toString();
  fetch(url)
  .then(res => res.text())
  .then(data => (data ? JSON.parse(data) : null))
  .then(data => setQuotationFromSource(data));
}