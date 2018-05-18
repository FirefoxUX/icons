#!/usr/bin/env node
'use strict';

console.log(new Date().toTimeString());
var shell = require('shelljs');

const icons = require('photon-icons/photon-icons.json');
const icons_dir = require.resolve('photon-icons/photon-icons.json').replace('photon-icons.json', 'icons/');

shell.rm('-rf', 'dist');
shell.mkdir('dist');
shell.cp('-R', 'html/*', 'dist');
shell.cp('-R', icons_dir, 'dist');
shell.ShellString('var data = ' + JSON.stringify(icons.icons, null, '  ')).to('dist/viewer/js/data.js');