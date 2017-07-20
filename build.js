#!/usr/bin/env node
'use strict';

var shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.mkdir('dist');
shell.cp('-R', ['html/*', 'icons'], 'dist');
const dirs = shell.ls('-R', 'icons');

let currDir;
var images = [];
for (let file of dirs) {
  if (!file.endsWith('.svg')) {
    if (currDir) {
      images.push(currDir);
    }
    currDir = {'name': file, 'items': []};
  } else {
    file = file.replace(currDir.name + '/','');
    currDir.items.push(file);
  }
}
if (currDir) {
  images.push(currDir);
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
