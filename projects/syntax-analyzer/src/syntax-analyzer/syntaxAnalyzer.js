import fs from 'fs';
import path from 'path';

import advance from './tokenizer';
import compile from './compiler';

function analyze(filePath, grammar) {
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

    let token = advance(input, grammar.lexicalElements);
    while (token) {
      compile(output, token, grammar.structure);
      token = advance(input, grammar.lexicalElements);
    }
    compile(output, token);
  });
}

const grammar = {
  // structure: {
  //   statements: 'statement*',
  //   statement: ['letStatement', 'ifStatement', 'whileStatement', 'doStatement', 'returnStatement', 'classDec'],
  //   letStatement: ['let', 'varName', '[!expression!]?', '=', 'expression', ';'],
  //   ifStatement: ['if', '(', 'expression', ')', '{', 'statements', '}', 'else!{!statements!}?'],
  //   whileStatement: ['while', '(', 'expression', ')', '{', 'statements', '}'],
  //   doStatement: ['do', 'subroutineCall', ';'],
  //   returnStatement: ['return', 'expression?', ';'],
  //   classDec: ['class', 'className', '{', 'classVarDec*', 'subRoutineDec*', '}'],
  //   classVarDec: ['static|field', 'type', 'varName', ',!varName*', ';'],
  //   type: 'int|char|boolean|className',
  //   subroutineDec: ['constructor|function|method', 'void|type', 'subroutineName', '(', 'parameterList?', ')', 'subroutineBody'],
  //   parameterList: ['type', 'varName', ',!type!varName*'],
  //   subroutineBody: ['{', 'varDec*', 'statements', '}'],
  //   varDec: ['var', 'type', 'varName', ',!varName*', ';'],
  //   className: 'identifier',
  //   subroutineName: 'identifier',
  //   varName: 'identifier',
  //   expression: ['term', 'op!term*'],
  //   term: 'integerConstant|stringConstant|keywordConstant|varName|varName![!expression!]|subroutineCall|(!expression!)|unaryOp!term',
  //   subroutineCall: 'functionCall|methodCall',
  //   functionCall: ['subroutineName', '(', 'expressionList?', ')'],
  //   methodCall: ['className|varName', '.', 'subroutineName', '(', 'expressionList?', ')'],
  //   expressionList: ['expression', ',!expression*'],
  //   op: '+|-|*|/|&|||<|>|=',
  //   unaryOp: '-|~',
  //   keywordConstant: 'true|false|null|this',
  // },
  lexicalElements: {
    keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char',
      'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
    symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
    integerConstant: n => Number(n) >= 0 && Number(n) <= 32767,
    identifier: /^\D\w*/,
    stringConstant: s => !s.includes('"') && !s.includes('\n'),
  },
};

analyze(process.argv[2], grammar);
