export function checkUrlForHttp(url) {
  if (url.length > 7 && !url.match(/^https*:\/\//)) {
    url = 'http://' + url;
  }
  return url;
};