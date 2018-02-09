#!/usr/bin/env node
'use strict';

var shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.mkdir('dist');
shell.cp('-R', ['html/*', 'icons'], 'dist');
const dirs = shell.ls('-R', 'icons');

const icons = require('photon-icons/photon-icons.json');

let currDir;
let images = [];
for (let file of dirs) {
  if (!file.endsWith('.svg')) {
    if (currDir) {
      images.push(currDir);
    }
    currDir = {'name': file, 'items': []};
  } else {
    let name = file.replace(currDir.name + '/','').replace('.svg', '');
    currDir.items.push({'name': name, 'location': file});
  }
}
if (currDir) {
  images.push(currDir);
}
for (let icon of icons.icons) {
  for (let category of icon.categories) {
    // find the entry in images with name == category.
    let collection = images.find(x => x.name == category);
    // If it doesn't exist, create it.
    if (!collection) {
      collection = {
        name: category,
        items: []
      };
      images.push(collection);
    }
    // Add the icon to that category.
    let source = icon.source.desktop['16'];
    let dest = 'dist/' + source;
    shell.mkdir('-p', dest);
    shell.rm('-r', dest);
    shell.cp(require.resolve('photon-icons/' + source), dest);
    collection.items.push({'name': icon.name, tags: icon.tags, 'location': source.replace('icons/', '')});
  }
}

images = images.sort((a, b) => {
  const aName = a.name;
  const bName = b.name;
  if (aName === 'new') {
    return -1;
  }
  if (bName === 'new') {
    return 1;
  }
  if (aName.startsWith('deprecated-')) {
    if (bName.startsWith('deprecated-')) {
      return aName.localeCompare(bName);
    }
    return 1;
  }
  if (bName.startsWith('deprecated-')) {
    return -1;
  }
  return aName.localeCompare(bName);
});
shell.ShellString('var data = ' + JSON.stringify(images, null, '  ')).to('dist/viewer/js/data.js');
