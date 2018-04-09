require('colors');
const inquirer = require('inquirer');

async function selectFile(rootTree, path = []) {
    let workingTree = rootTree;
    // navigate to path
    for (let dir of path) {
      workingTree = workingTree.children.find(child => child.name === dir);
    }
  
    // give a selection of files
    const dirEntities = workingTree.children.map((child) => {
      child.printName = child.type === 'directory' ? child.name.bold.cyan : child.name;
      return child.printName;
    });
    
    dirEntities.push(new inquirer.Separator());
    dirEntities.unshift('..');
    const answers = await inquirer.prompt([{
      name: 'fileName',
      type: 'list',
      message: workingTree.path,
      choices: dirEntities
    }]);
  
    if (answers.fileName === '..') {
      return await selectFile(rootTree, path.slice(0,-1));
    } else {
      const selectedFile = workingTree.children.find(child => child.printName === answers.fileName);
      if (selectedFile.type === 'file') {
        return selectedFile;
      } else {
        return await selectFile(rootTree, path.concat(selectedFile.name));
      }
    }
  }
  
  function findBody(codeText) {
  // find first {
    const startIndex = codeText.indexOf('{');  
  // set bracketCounter to 1 and keep down while bracketCounter is > 0
    let bracketCounter = 1;
    let workingIndex = startIndex;
    while (bracketCounter > 0) {
      workingIndex++;
      if (codeText.charAt(workingIndex) === '{') {
        bracketCounter++;
      }
      if (codeText.charAt(workingIndex) === '}') {
        bracketCounter--;
      }
    }
    return codeText.substring(startIndex, workingIndex+1);
  }
  
  module.exports = {
    selectFile,
    findBody
  };
  