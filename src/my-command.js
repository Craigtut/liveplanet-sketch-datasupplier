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
  DataSupplier.registerDataSupplier('public.text', 'Random Video Name', 'SupplyRandomVideoName');
  DataSupplier.registerDataSupplier('public.text', 'Random Video Channel', 'SupplyRandomVideoChannel');
  DataSupplier.registerDataSupplier('public.image', 'Random Video Cover', 'SupplyRandomVideoCover');
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
  let dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      DataSupplier.supplyDataAtIndex(dataKey, video.name, index);
    });
  });
}

export function onSupplyRandomVideoChannel(context) {
  let dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      DataSupplier.supplyDataAtIndex(dataKey, video.company.name, index);
    });
  });
}

export function onSupplyRandomVideoCover(context) {
  let dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  items.forEach((item, index) => {
    getRandomVideo().then((video) => {
      getImageFromURL(video.image_url).then((imagePath) => {
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
