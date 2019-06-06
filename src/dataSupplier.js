import api from './api';

let recentVideoList = [];

export async function getRandomVideo() {
  console.log(recentVideoList)
  if (recentVideoList.length < 1) {
    recentVideoList = await api.fetchRecent();
  }

  const numItems = recentVideoList.count;
  const randomKey = Math.floor(Math.random() * (numItems + 1));
  return recentVideoList.items[randomKey];
}

export async function getRecentList() {

}

export async function getFeaturedList() {

}

