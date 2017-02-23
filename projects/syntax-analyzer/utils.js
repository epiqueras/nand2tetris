'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = testRule;
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