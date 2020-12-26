#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');
const utils = require('./src/utils');
const basePath = process.cwd();

let argv = yargs
  .option('api', {
    alias: 'a',
    describe: '生成Api',
    type: 'boolean',
  })
  .option('module', {
    alias: 'm',
    describe: '生成模块',
    type: 'boolean',
  })
  .option('target', {
    alias: 't',
    describe: '模块路径',
    type: 'string',
    default: './components',
  }).argv;

// console.log(argv);

if (argv._.length) {
  argv._.forEach(item => {
    if (argv.module) {
      // 生产组件
      utils.CreateSnModule(`${basePath}\\${argv.target}`, item);
    }
  });
}
