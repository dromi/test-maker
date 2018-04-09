#!/usr/bin/env node
'use strict';

const dirTree = require('directory-tree');
const inquirer = require('inquirer');
const fs = require('fs');

const fileBrowser = require('../lib/FileBrowser.js');
const codeAnalyzer = require('../lib/CodeAnalyzer.js');

async function run(inputArgs) {
  // get path or use working dir
  const projectDir = inputArgs.length ? inputArgs[0] : __dirname;
  //load dirtree
  let workingTree = dirTree(projectDir, {extensions:/\.js/});
  
  // if there is an app folder, go to it
  const appFolder = workingTree.children.find(child => child.name === 'app');
  if (appFolder) {
    workingTree = appFolder;
  }
  
  // check if there's a package.json present otherwise reject dir
  if(!workingTree.children.find(child => child.name === 'package.json')) {
    throw new Error(`${projectDir} doesn't seem like a valid node directory`);
  }

  // Let user chose file
  const file = await fileBrowser.selectFile(workingTree);

  // reject a non-js file
  if (file.extension !== '.js') {
    throw new Error(`${file.name} is not a .js file`);
  }

  // read file and find functions
  const fileContent = fs.readFileSync(file.path, 'utf8');
  const matchedFunctions = codeAnalyzer.findFunctions(fileContent);
  
  if (!matchedFunctions) {
    throw new Error(`Could not find any functions in ${file.path}`);
  }

  const answers = await inquirer.prompt([{
    name: 'function',
    type: 'list',
    message: 'Select function for testing:',
    choices: matchedFunctions
  }]);
  const split = fileContent.split(answers.function);
  const codeBody = fileBrowser.findBody(split[1]);
  console.log(codeBody);
  const stubables = codeAnalyzer.findStubables(codeBody);
  console.log({stubables})

}

async function main(inputArgs) {
  try{
    await run(inputArgs);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
}

main(process.argv.slice(2));