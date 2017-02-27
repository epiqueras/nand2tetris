'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.testRule = testRule;
exports.isQuote = isQuote;
exports.openTag = openTag;
exports.closeTag = closeTag;
exports.writeWithTags = writeWithTags;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testRule(token, test) {
  if (test instanceof RegExp) return test.test(token);
  switch (typeof test === 'undefined' ? 'undefined' : _typeof(test)) {
    case 'object':
      return test.find(function (t) {
        return t === token;
      });
    case 'function':
      return test(token);
    case 'string':
      return test === token;
    default:
      throw new Error('Invalid grammar rule.');
  }
}

function isQuote(char) {
  return char === '"' || char === "'";
}

function getWhitespace(indentation) {
  return indentation ? '  '.repeat(indentation) : '';
}

function openTag(output, tag, indentation) {
  _fs2.default.writeSync(output, getWhitespace(indentation) + '<' + tag + '>\n');
}

function closeTag(output, tag, indentation) {
  _fs2.default.writeSync(output, getWhitespace(indentation) + '</' + tag + '>\n');
}

function writeWithTags(output, content, tag, indentation) {
  var strToWrite = content;
  switch (strToWrite) {
    case '<':
      strToWrite = '&lt;';
      break;
    case '>':
      strToWrite = '&gt;';
      break;
    case '&':
      strToWrite = '&amp;';
      break;
    default:
      break;
  }
  _fs2.default.writeSync(output, getWhitespace(indentation) + '<' + tag + '>' + strToWrite + '</' + tag + '>\n');
}