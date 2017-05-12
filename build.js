#!/usr/bin/env node
'use strict';

var shell = require('shelljs');

shell.cp('-R', ['viewer', 'index.html', 'icons'], 'dist');
const dirs = shell.ls('-R', 'icons');

let currDir;
const images = [];
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
shell.ShellString('var data = ' + JSON.stringify(images, null, '  ')).to('dist/viewer/js/data.js');
