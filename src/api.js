const BASE_URL = 'https://cloud.liveplanet.net';

function fetchFeatured() {
  console.log('Fetching weekly featured');
  return fetch(`${BASE_URL}/api/v1/spotlight/highlights`).then(res => res.json());
}

function fetchRecommended(limit = 10, offset = 0) {
  console.log('Fetching featured');
  let endpoint = `${BASE_URL}/api/v1/spotlight/videos/popular`;
  endpoint += (limit !== undefined) ? `?limit=${limit}&offset=${offset}` : '';
  return fetch(endpoint).then(res => res.json());
}

function fetchRecent(limit = 10, offset = 0) {
  console.log('Fetching recent');
  let endpoint = `${BASE_URL}/api/v1/spotlight/recents`;
  endpoint += (limit !== undefined) ? `?limit=${limit}&offset=${offset}` : '';
  return fetch(endpoint).then(res => res.json());
}

export default {
  fetchFeatured,
  fetchRecommended,
  fetchRecent,
};
