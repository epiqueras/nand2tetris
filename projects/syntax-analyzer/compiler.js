'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compiler;

var _utils = require('./utils');

var openTags = [];
var isComment = false;
var prevToken = { content: '', tag: '' };

function compiler(output, token, structure) {
  if (!token) {
    // End of file
    openTags = [];
    return (0, _utils.closeTag)(output, 'tokens');
  } else if (!openTags.length) {
    // First token
    openTags.push({ tag: 'tokens' });
    (0, _utils.openTag)(output, 'tokens');
  }

  // Possible comment
  if (!isComment && token.content === '/') isComment = true;

  // Check if it's really a comment
  if (isComment === true && prevToken.content === '/') {
    if (token.content === '*') isComment = 'multiline';else if (token.content === '/') isComment = 'inline';else {
      // Was not a comment
      isComment = false;
      (0, _utils.writeWithTags)(output, '/', 'symbol', openTags.length);
    }
  }

  // Write if it's not a newline character or part of a comment
  if (!isComment && token.tag !== 'eol') {
    if (!structure) (0, _utils.writeWithTags)(output, token.content, token.tag, openTags.length);
  }

  if (isComment === 'multiline' && prevToken.content === '*' && token.content === '/') isComment = false; // End of multiline comment?
  if (isComment === 'inline' && token.tag === 'eol') isComment = false; // End of inline comment?

  prevToken = token;
  return null;
}