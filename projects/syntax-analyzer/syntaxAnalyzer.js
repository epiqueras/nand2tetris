'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function analyze(filePath, grammar) {
  var sourceFiles = void 0;

  // Get source file or source files in directory
  if (filePath.slice(filePath.lastIndexOf('.')) === '.jack') {
    sourceFiles = [filePath];
  } else {
    sourceFiles = _fs2.default.readdirSync(filePath).filter(function (file) {
      return file[0] !== '.' && file.slice(file.lastIndexOf('.')) === '.jack';
    }).map(function (file) {
      return _path2.default.resolve(filePath, file);
    });
  }

  console.log('Compiling: ' + sourceFiles);

  // Compile each source file
  sourceFiles.forEach(function (sourceFile) {
    var input = _fs2.default.openSync(sourceFile, 'r');
    var output = _fs2.default.openSync(sourceFile.slice(0, sourceFile.lastIndexOf('.')) + '.xml', 'w');

    var token = (0, _tokenizer2.default)(input, grammar.lexicalElements);
    while (token) {
      (0, _compiler2.default)(output, token, grammar.structure);
      token = (0, _tokenizer2.default)(input, grammar.lexicalElements);
    }
    (0, _compiler2.default)(output, token);
  });
}

var grammar = {
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
    keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
    symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
    integerConstant: function integerConstant(n) {
      return Number(n) >= 0 && Number(n) <= 32767;
    },
    identifier: /^\D\w*/,
    stringConstant: function stringConstant(s) {
      return !s.includes('"') && !s.includes('\n');
    }
  }
};

analyze(process.argv[2], grammar);