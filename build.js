#!/usr/bin/env node
'use strict';

var shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.mkdir('dist');
shell.cp('-R', 'html/*', 'dist');

const icons = require('photon-icons/photon-icons.json');

let images = [];
for (let icon of icons.icons) {
  for (let category of icon.categories) {
    if (category == 'deprecated') {
      continue;
    }
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
    let tags = icon.tags;
    if (icon.categories.indexOf('deprecated') != -1) {
      tags.push('deprecated');
    }
    // Add the icon to that category.
    for (let size in icon.source.desktop) {
      let source = icon.source.desktop[size]
      let dest = 'dist/' + source;
      // console.log(source, dest.replace(/\/[^\/]*$/, ''));
      shell.mkdir('-p', dest.replace(/\/[^\/]*$/, ''));
      shell.cp(require.resolve('photon-icons/' + source), dest);
      collection.items.push({'name': icon.name, tags: tags, 'location': source.replace('icons/', '')});
    }
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
