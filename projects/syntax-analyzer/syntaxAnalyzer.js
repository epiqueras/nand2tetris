'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Compiler from './Compiler';

function analyze(filePath, symbols) {
  var sourceFiles = void 0;

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

  sourceFiles.forEach(function (sourceFile) {
    var input = _fs2.default.openSync(sourceFile, 'r');
    var output = _fs2.default.openSync(sourceFile.slice(0, sourceFile.lastIndexOf('.')) + '.xml', 'w');

    var token = (0, _tokenizer2.default)(input, symbols);
    while (token) {
      _fs2.default.writeSync(output, '<' + token.tag + '>' + token.content + '</' + token.tag + '>\n');
      token = (0, _tokenizer2.default)(input, symbols);
    }
  });
}

var grammar = {
  lexicalElements: {
    keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
    symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
    integerConstant: function integerConstant(n) {
      return Number(n) >= 0 && Number(n) <= 32767;
    },
    stringConstant: /^\D\w*/
  }
};

analyze(process.argv[2], grammar.lexicalElements);