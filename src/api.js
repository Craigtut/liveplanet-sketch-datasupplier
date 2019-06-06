const BASE_URL = 'https://cloud.liveplanet.net';

function fetchFeatured() {
  console.log('Fetching weekly featured')
  return fetch(`${BASE_URL}/api/v2/events/featured?weekly`).then(res =>
    res.json()
  );
}

function fetchRecommended(limit, offset = 0) {
  console.log('Fetching featured')
  let endpoint = `${BASE_URL}/api/v2/events/featured`;
  endpoint += (limit !== undefined) ? `?limit=${limit}&offset=${offset}` : '';
  return fetch(endpoint).then(res => res.json());
}

function fetchRecent(limit, offset = 0) {
  console.log('Fetching recent')
  let endpoint = `${BASE_URL}/api/v2/events`;
  endpoint += (limit !== undefined) ? `?limit=${limit}&offset=${offset}` : '';
  return fetch(endpoint).then(res => res.json());
}

export default {
  fetchFeatured,
  fetchRecommended,
  fetchRecent,
}