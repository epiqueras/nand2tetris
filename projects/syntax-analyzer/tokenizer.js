'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = advance;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-useless-escape */
var currentChar = Buffer.from([0x20]);

function nextChar(input) {
  return _fs2.default.readSync(input, currentChar, 0, 1);
}

function nextToken(input, lexicalElements) {
  var token = '';

  while (/\s/.test(currentChar.toString()) && nextChar(input)) {
    token = currentChar.toString();
  }if ((0, _utils.testRule)(currentChar.toString(), lexicalElements.symbol)) {
    token = currentChar.toString();
    currentChar.write(' ');
    return token;
  }

  var bytesRead = nextChar(input);
  while (bytesRead && !/\s/.test(currentChar.toString()) && !(0, _utils.testRule)(currentChar.toString(), lexicalElements.symbol)) {
    token += currentChar.toString();
    bytesRead = nextChar(input);
  }

  return token.trim();
}

function categorize(token, lexicalElements) {
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