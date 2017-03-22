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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zeW50YXgtYW5hbHl6ZXIvdXRpbHMuanMiXSwibmFtZXMiOlsidGVzdFJ1bGUiLCJpc1F1b3RlIiwib3BlblRhZyIsImNsb3NlVGFnIiwid3JpdGVXaXRoVGFncyIsInRva2VuIiwidGVzdCIsIlJlZ0V4cCIsImZpbmQiLCJ0IiwiRXJyb3IiLCJjaGFyIiwiZ2V0V2hpdGVzcGFjZSIsImluZGVudGF0aW9uIiwicmVwZWF0Iiwib3V0cHV0IiwidGFnIiwid3JpdGVTeW5jIiwiY29udGVudCIsInN0clRvV3JpdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBRWdCQSxRLEdBQUFBLFE7UUFjQUMsTyxHQUFBQSxPO1FBUUFDLE8sR0FBQUEsTztRQUlBQyxRLEdBQUFBLFE7UUFJQUMsYSxHQUFBQSxhOztBQWhDaEI7Ozs7OztBQUVPLFNBQVNKLFFBQVQsQ0FBa0JLLEtBQWxCLEVBQXlCQyxJQUF6QixFQUErQjtBQUNwQyxNQUFJQSxnQkFBZ0JDLE1BQXBCLEVBQTRCLE9BQU9ELEtBQUtBLElBQUwsQ0FBVUQsS0FBVixDQUFQO0FBQzVCLGlCQUFlQyxJQUFmLHlDQUFlQSxJQUFmO0FBQ0UsU0FBSyxRQUFMO0FBQ0UsYUFBT0EsS0FBS0UsSUFBTCxDQUFVO0FBQUEsZUFBS0MsTUFBTUosS0FBWDtBQUFBLE9BQVYsQ0FBUDtBQUNGLFNBQUssVUFBTDtBQUNFLGFBQU9DLEtBQUtELEtBQUwsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU9DLFNBQVNELEtBQWhCO0FBQ0Y7QUFDRSxZQUFNLElBQUlLLEtBQUosQ0FBVSx1QkFBVixDQUFOO0FBUko7QUFVRDs7QUFFTSxTQUFTVCxPQUFULENBQWlCVSxJQUFqQixFQUF1QjtBQUM1QixTQUFPQSxTQUFTLEdBQVQsSUFBZ0JBLFNBQVMsR0FBaEM7QUFDRDs7QUFFRCxTQUFTQyxhQUFULENBQXVCQyxXQUF2QixFQUFvQztBQUNsQyxTQUFPQSxjQUFjLEtBQUtDLE1BQUwsQ0FBWUQsV0FBWixDQUFkLEdBQXlDLEVBQWhEO0FBQ0Q7O0FBRU0sU0FBU1gsT0FBVCxDQUFpQmEsTUFBakIsRUFBeUJDLEdBQXpCLEVBQThCSCxXQUE5QixFQUEyQztBQUNoRCxlQUFHSSxTQUFILENBQWFGLE1BQWIsRUFBd0JILGNBQWNDLFdBQWQsQ0FBeEIsU0FBc0RHLEdBQXREO0FBQ0Q7O0FBRU0sU0FBU2IsUUFBVCxDQUFrQlksTUFBbEIsRUFBMEJDLEdBQTFCLEVBQStCSCxXQUEvQixFQUE0QztBQUNqRCxlQUFHSSxTQUFILENBQWFGLE1BQWIsRUFBd0JILGNBQWNDLFdBQWQsQ0FBeEIsVUFBdURHLEdBQXZEO0FBQ0Q7O0FBRU0sU0FBU1osYUFBVCxDQUF1QlcsTUFBdkIsRUFBK0JHLE9BQS9CLEVBQXdDRixHQUF4QyxFQUE2Q0gsV0FBN0MsRUFBMEQ7QUFDL0QsTUFBSU0sYUFBYUQsT0FBakI7QUFDQSxVQUFRQyxVQUFSO0FBQ0UsU0FBSyxHQUFMO0FBQ0VBLG1CQUFhLE1BQWI7QUFDQTtBQUNGLFNBQUssR0FBTDtBQUNFQSxtQkFBYSxNQUFiO0FBQ0E7QUFDRixTQUFLLEdBQUw7QUFDRUEsbUJBQWEsT0FBYjtBQUNBO0FBQ0Y7QUFDRTtBQVhKO0FBYUEsZUFBR0YsU0FBSCxDQUFhRixNQUFiLEVBQXdCSCxjQUFjQyxXQUFkLENBQXhCLFNBQXNERyxHQUF0RCxTQUE2REcsVUFBN0QsVUFBNEVILEdBQTVFO0FBQ0QiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJ1bGUodG9rZW4sIHRlc3QpIHtcbiAgaWYgKHRlc3QgaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiB0ZXN0LnRlc3QodG9rZW4pO1xuICBzd2l0Y2ggKHR5cGVvZiB0ZXN0KSB7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHJldHVybiB0ZXN0LmZpbmQodCA9PiB0ID09PSB0b2tlbik7XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgcmV0dXJuIHRlc3QodG9rZW4pO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdGVzdCA9PT0gdG9rZW47XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBncmFtbWFyIHJ1bGUuJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUXVvdGUoY2hhcikge1xuICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbn1cblxuZnVuY3Rpb24gZ2V0V2hpdGVzcGFjZShpbmRlbnRhdGlvbikge1xuICByZXR1cm4gaW5kZW50YXRpb24gPyAnICAnLnJlcGVhdChpbmRlbnRhdGlvbikgOiAnJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5UYWcob3V0cHV0LCB0YWcsIGluZGVudGF0aW9uKSB7XG4gIGZzLndyaXRlU3luYyhvdXRwdXQsIGAke2dldFdoaXRlc3BhY2UoaW5kZW50YXRpb24pfTwke3RhZ30+XFxuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZVRhZyhvdXRwdXQsIHRhZywgaW5kZW50YXRpb24pIHtcbiAgZnMud3JpdGVTeW5jKG91dHB1dCwgYCR7Z2V0V2hpdGVzcGFjZShpbmRlbnRhdGlvbil9PC8ke3RhZ30+XFxuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVdpdGhUYWdzKG91dHB1dCwgY29udGVudCwgdGFnLCBpbmRlbnRhdGlvbikge1xuICBsZXQgc3RyVG9Xcml0ZSA9IGNvbnRlbnQ7XG4gIHN3aXRjaCAoc3RyVG9Xcml0ZSkge1xuICAgIGNhc2UgJzwnOlxuICAgICAgc3RyVG9Xcml0ZSA9ICcmbHQ7JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJz4nOlxuICAgICAgc3RyVG9Xcml0ZSA9ICcmZ3Q7JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyYnOlxuICAgICAgc3RyVG9Xcml0ZSA9ICcmYW1wOyc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbiAgZnMud3JpdGVTeW5jKG91dHB1dCwgYCR7Z2V0V2hpdGVzcGFjZShpbmRlbnRhdGlvbil9PCR7dGFnfT4ke3N0clRvV3JpdGV9PC8ke3RhZ30+XFxuYCk7XG59XG4iXX0=