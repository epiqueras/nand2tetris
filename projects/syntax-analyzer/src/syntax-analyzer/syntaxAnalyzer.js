import fs from 'fs';
import path from 'path';

import advance from './tokenizer';
// import Compiler from './Compiler';

function analyze(filePath, symbols) {
  let sourceFiles;

  if (filePath.slice(filePath.lastIndexOf('.')) === '.jack') {
    sourceFiles = [filePath];
  } else {
    sourceFiles = fs.readdirSync(filePath).filter(file => file[0] !== '.' && file.slice(file.lastIndexOf('.')) === '.jack')
    .map(file => path.resolve(filePath, file));
  }

  console.log(`Compiling: ${sourceFiles}`);

  sourceFiles.forEach((sourceFile) => {
    const input = fs.openSync(sourceFile, 'r');
    const output = fs.openSync(`${sourceFile.slice(0, sourceFile.lastIndexOf('.'))}.xml`, 'w');

    let token = advance(input, symbols);
    while (token) {
      fs.writeSync(output, `<${token.tag}>${token.content}</${token.tag}>\n`);
      token = advance(input, symbols);
    }
  });
}

const grammar = {
  lexicalElements: {
    keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char',
      'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
    symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
    integerConstant: n => Number(n) >= 0 && Number(n) <= 32767,
    stringConstant: /^\D\w*/,
  },
};

analyze(process.argv[2], grammar.lexicalElements);
