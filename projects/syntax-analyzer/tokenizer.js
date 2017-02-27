'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = advance;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentChar = Buffer.from([0x20]); /* eslint-disable no-useless-escape */

var isLiteral = false;

function nextChar(input) {
  return _fs2.default.readSync(input, currentChar, 0, 1);
}

function nextToken(input, lexicalElements) {
  var token = '';

  // Skip over whitespace
  while (currentChar.toString() !== _os2.default.EOL && /\s/.test(currentChar.toString()) && nextChar(input)) {
    token = currentChar.toString();
  } // Stop and return symbols
  if ((0, _utils.testRule)(currentChar.toString(), lexicalElements.symbol) || currentChar.toString() === _os2.default.EOL) {
    token = currentChar.toString();
    currentChar.write(' ');
    return token;
  }

  // Different rules for string literals
  if ((0, _utils.isQuote)(currentChar.toString())) {
    isLiteral = currentChar.toString();
    token = '';
    var _bytesRead = nextChar(input);
    while (_bytesRead && currentChar.toString() !== isLiteral) {
      token += currentChar.toString();
      _bytesRead = nextChar(input);
    }
    currentChar.write(' ');
    return token;
  }

  // Concatenate other characters
  var bytesRead = nextChar(input);
  while (bytesRead && !/\s/.test(currentChar.toString()) && !(0, _utils.testRule)(currentChar.toString(), lexicalElements.symbol)) {
    token += currentChar.toString();
    bytesRead = nextChar(input);
  }

  return token.trim();
}

function categorize(token, lexicalElements) {
  if (isLiteral) {
    isLiteral = false;
    if (lexicalElements.stringConstant) {
      if ((0, _utils.testRule)(token, lexicalElements.stringConstant)) return 'stringConstant';
      throw new Error('Invalid string constant.');
    } else return 'stringConstant';
  }

  if (token === _os2.default.EOL) return 'eol';
  var matched = Object.keys(lexicalElements).find(function (element) {
    return (0, _utils.testRule)(token, lexicalElements[element]);
  });
  if (matched) return matched;
  throw new Error('Invalid token.');
}

function advance(input, lexicalElements) {
  var token = nextToken(input, lexicalElements);
  return token ? { content: token, tag: categorize(token, lexicalElements) } : token;
}