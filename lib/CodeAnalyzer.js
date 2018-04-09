function findFunctions(code) {
  return code.match(/(async )?function\s+\w+?\(.*\)/g);
}

function findStubables(code) {
  // remove comments
  code = _removeComments(code);
  // check each line for function calls
  return code.match(/[\w.]+\(.*?\)/g);
}

function _removeComments(code) {
  // Removes comment blocks: /* */
  code = code.replace(/\/\*[^]*?\*\//g, '');
  // Removes inline comments: //
  code = code.replace(/^[^\S\n]*\/\/.*/gm, '');
  return code;
}

module.exports = {
  findFunctions,
  findStubables
}