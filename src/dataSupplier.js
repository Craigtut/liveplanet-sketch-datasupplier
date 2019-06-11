import { Settings } from 'sketch';

import { RECENT_LIST, RECENT_LAST_FETCH, FEATURED_LIST, FEATURED_LAST_FETCH, RECOMMENDED_LIST, RECOMMENDED_LAST_FETCH } from './settingsKeys';
import api from './api';

const hourInSeconds = 360000;

async function getAndStore(apiFunction, storageKey, fetchedKey) {
  let list = Settings.sessionVariable(storageKey);
  const lastFetched = Settings.sessionVariable(fetchedKey);

  if (!list || (Date.now() - lastFetched) > hourInSeconds) {
    list = await apiFunction();
    Settings.setSessionVariable(storageKey, list);
    Settings.setSessionVariable(fetchedKey, Date.now());
  }

  return list;
}

async function getFeatured() {
  return getAndStore(api.fetchFeatured, FEATURED_LIST, FEATURED_LAST_FETCH);
}

async function getRecommended() {
  return getAndStore(api.fetchRecommended, RECOMMENDED_LIST, RECOMMENDED_LAST_FETCH);
}

async function getRecent() {
  return getAndStore(api.fetchRecent, RECENT_LIST, RECENT_LAST_FETCH);
}

// Returns a single video selected from all lists
export async function getRandomVideo() {
  const recentList = await getRecent();
  const featuredList = await getFeatured();
  const recommendedList = await getRecommended();
  const fullItemsArray = recentList.items.concat(featuredList.items).concat(recommendedList.items);

  const numItems = fullItemsArray.length;
  const randomKey = Math.floor(Math.random() * (numItems + 1));
  return fullItemsArray[randomKey];
}

export async function getRecommendedList() {
  const recommendedList = await getRecommended();
  return recommendedList.items;
}

export async function getFeaturedList() {

}

