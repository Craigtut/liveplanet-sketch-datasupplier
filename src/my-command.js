import moment from 'moment';

const sketch = require('sketch');
const { DataSupplier, UI, Settings } = sketch;

const fs = require('@skpm/fs');
const os = require('os');
const path = require('path');
const util = require('util');

import { getRandomVideo } from './dataSupplier';


const FOLDER = path.join(os.tmpdir(), 'com.liveplanet.datasupplier');

export function onStartup () {
  // To register the plugin, uncomment the relevant type:
  DataSupplier.registerDataSupplier('public.text', 'Video Name', 'SupplyRandomVideoName');
  DataSupplier.registerDataSupplier('public.text', 'Channel Name', 'SupplyRandomChannelName');
  DataSupplier.registerDataSupplier('public.text', 'Upload Time', 'SupplyRandomUploadTime');
  DataSupplier.registerDataSupplier('public.image', 'Video Thumbnail', 'SupplyRandomVideoCover');
  DataSupplier.registerDataSupplier('public.image', 'Channel Image', 'SupplyRandomChannelImage');
  DataSupplier.registerDataSupplier('public.image', 'Channel Cover', 'SupplyRandomChannelCover');
}

export function onShutdown () {
  DataSupplier.deregisterDataSuppliers();
  try {
    if (fs.existsSync(FOLDER)) {
      fs.rmdirSync(FOLDER);
    }
  } catch (err) {
    console.error(err);
  }
}

export function onSupplyRandomVideoName(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      DataSupplier.supplyDataAtIndex(dataKey, video.name, index);
    });
  });
}

export function onSupplyRandomChannelName(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      DataSupplier.supplyDataAtIndex(dataKey, video.channel.name, index);
    });
  });
}

export function onSupplyRandomUploadTime(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      const time = video.published_at || video.created_at || 1318781876;
      const publishTime = moment.unix(time);
      DataSupplier.supplyDataAtIndex(dataKey, publishTime.fromNow(), index);
    });
  });
}

export function onSupplyRandomVideoCover(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      getImageFromURL(video.image_url).then((imagePath) => {
        DataSupplier.supplyDataAtIndex(dataKey, imagePath, index);
      });
    });
  });
}

export function onSupplyRandomChannelImage(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      getImageFromURL(video.channel.image_medium_url).then((imagePath) => {
        DataSupplier.supplyDataAtIndex(dataKey, imagePath, index);
      });
    });
  });
}

export function onSupplyRandomChannelCover(context) {
  const dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      getImageFromURL(video.channel.cover_medium_url).then((imagePath) => {
        DataSupplier.supplyDataAtIndex(dataKey, imagePath, index);
      });
    });
  });
}

function getImageFromURL(url) {
  UI.message('🕑 Downloading…');
  return fetch(url)
    .then(res => res.blob())
    // TODO: use imageData directly, once #19391 is implemented
    .then(saveTempFileFromImageData)
    .catch((err) => {
      console.error(err);
      UI.message(err);
      return context.plugin.urlForResourceNamed('placeholder.png').path();
    });
}

function saveTempFileFromImageData(imageData) {
  const guid = NSProcessInfo.processInfo().globallyUniqueString();
  const imagePath = path.join(FOLDER, `${guid}.jpg`);
  try {
    fs.mkdirSync(FOLDER);
  } catch (err) {
    // probably because the folder already exists
    // TODO: check that it is really because it already exists
  }
  try {
    fs.writeFileSync(imagePath, imageData, 'NSData');
    return imagePath;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
