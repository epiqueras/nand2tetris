'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compiler;

var _utils = require('./utils');

var openTags = [];

function compiler(output, token, structure) {
  if (!token) {
    return (0, _utils.closeTag)(output, 'tokens');
  } else if (!openTags.length) {
    openTags.push({ tag: 'tokens' });
    (0, _utils.openTag)(output, 'tokens');
  }

  if (!structure) (0, _utils.writeWithTags)(output, token.content, token.tag, openTags.length);
  return null;
}