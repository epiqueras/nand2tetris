import fs from 'fs';
import path from 'path';

import advance from './tokenizer';
import compile from './compiler';

function analyze(filePath, lexicalElements, grammar) {
  let sourceFiles;

  // Get source file or source files in directory
  if (filePath.slice(filePath.lastIndexOf('.')) === '.jack') {
    sourceFiles = [filePath];
  } else {
    sourceFiles = fs.readdirSync(filePath).filter(file => file[0] !== '.' && file.slice(file.lastIndexOf('.')) === '.jack')
    .map(file => path.resolve(filePath, file));
  }

  console.log(`Compiling: ${sourceFiles}`);

  // Compile each source file
  sourceFiles.forEach((sourceFile) => {
    const input = fs.openSync(sourceFile, 'r');
    const output = fs.openSync(`${sourceFile.slice(0, sourceFile.lastIndexOf('.'))}.xml`, 'w');

    let token = advance(input, lexicalElements);
    while (token) {
      compile(output, token, grammar);
      token = advance(input, lexicalElements);
    }
    compile(output, token, grammar);
  });
}

const lexicalElements = {
  keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char',
    'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
  symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
  integerConstant: n => Number(n) >= 0 && Number(n) <= 32767,
  identifier: /^\D\w*/,
  stringConstant: s => !s.includes('"') && !s.includes('\n'),
};

analyze(process.argv[2], lexicalElements, false);
