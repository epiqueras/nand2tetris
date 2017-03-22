'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.parseStructure = parseStructure;
exports.default = compiler;

var _utils = require('./utils');

var openTags = [];
var isComment = false;
var prevToken = { tag: '', content: '' };
var ruleIndexes = [];

var indexSnapshot = [];

function parseStructure(structure) {
  if (!structure) return null;

  Object.keys(structure).forEach(function (key) {
    switch (_typeof(structure[key])) {
      case 'object':
        structure[key] = { // eslint-disable-line no-param-reassign
          parts: structure[key].map(function (str) {
            var lastChar = str[str.length - 1];
            return {
              parts: str.split('!').map(function (part) {
                return (/\*|\?/.test(part[part.length - 1]) ? part.slice(0, part.length - 1) : part
                );
              }),
              optional: lastChar === '?',
              multiple: lastChar === '*'
            };
          }),
          optional: false,
          multiple: false
        };
        break;
      case 'string':
        structure[key] = { // eslint-disable-line no-param-reassign
          parts: structure[key].split('!').map(function (part) {
            return (/\*|\?/.test(part[part.length - 1]) ? part.slice(0, part.length - 1) : part
            );
          }),
          optional: structure[key][structure[key].length - 1] === '?',
          multiple: structure[key][structure[key].length - 1] === '*'
        };
        break;
      default:
        throw new Error('Invalid rule.');
    }
  });

  return structure;
}

function fetchMatch(token, _ref) {
  var structure = _ref.structure,
      lexicalElements = _ref.lexicalElements;

  // Get the last index
  var currentTagIndexes = ruleIndexes[ruleIndexes.length - 1];

  // Get the current tag
  var currentTagName = openTags[ruleIndexes.length].tag;

  var str = currentTagName;
  var optional = false;
  var multiple = false;

  currentTagIndexes.forEach(function (index) {
    str = structure[str] ? structure[str].parts[index] : str.parts[index];
    if (!optional) {
      optional = structure[str] ? structure[str].optional : str && str.optional;
    }
    if (!multiple) {
      multiple = structure[str] ? structure[str].multiple : str && str.multiple;
      if (multiple) indexSnapshot = ruleIndexes;
    }
  });

  if (!str) {
    currentTagIndexes.pop();
    currentTagIndexes[currentTagIndexes.length - 1] += 1;
    return fetchMatch(token, { structure: structure, lexicalElements: lexicalElements });
  } else if (typeof str !== 'string' || structure[str]) {
    currentTagIndexes.push(0);
    return fetchMatch(token, { structure: structure, lexicalElements: lexicalElements });
  }

  if (!multiple) {
    currentTagIndexes[currentTagIndexes.length - 1] += 1;
  }

  // Lexical element match
  if (str === token.content || lexicalElements[str] && (0, _utils.testRule)(token, lexicalElements[str])) {
    openTags[ruleIndexes.length].content.push(token);
    return token;
  } else if (multiple) {
    // No match and multiple
    currentTagIndexes[currentTagIndexes.length - 1] += 1;
    return fetchMatch(token, { structure: structure, lexicalElements: lexicalElements });
  } else if (optional) {
    return fetchMatch(token, { structure: structure, lexicalElements: lexicalElements });
  }

  return null;
}

// Compiles a rule
function compileStatement(output, token, grammar) {
  var structure = grammar.structure;


  if (!ruleIndexes.length) {
    // No current rule
    var newRule = structure.statement.parts[0].split('|').find(function (type) {
      return structure[type].parts[0].parts[0].split('|').find(function (str) {
        return str === token.content;
      });
    });

    if (newRule) {
      openTags.push({ tag: newRule, content: [token] });
      ruleIndexes.push([1]);
    }
    return null;
  }

  var matched = fetchMatch(token, grammar);
}

// Drives compiler logic. Skips comments and checks if in structure or token mode
// TODO: Optimize by removing unnecesary checks
function compiler(output, token, grammar) {
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
    if (!grammar.structure) (0, _utils.writeWithTags)(output, token.content, token.tag, openTags.length);else {
      compileStatement(output, token, grammar);
    }
  }

  if (isComment === 'multiline' && prevToken.content === '*' && token.content === '/') isComment = false; // End of multiline comment?
  if (isComment === 'inline' && token.tag === 'eol') isComment = false; // End of inline comment?

  prevToken = token;
  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zeW50YXgtYW5hbHl6ZXIvY29tcGlsZXIuanMiXSwibmFtZXMiOlsicGFyc2VTdHJ1Y3R1cmUiLCJjb21waWxlciIsIm9wZW5UYWdzIiwiaXNDb21tZW50IiwicHJldlRva2VuIiwidGFnIiwiY29udGVudCIsInJ1bGVJbmRleGVzIiwiaW5kZXhTbmFwc2hvdCIsInN0cnVjdHVyZSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwicGFydHMiLCJtYXAiLCJzdHIiLCJsYXN0Q2hhciIsImxlbmd0aCIsInNwbGl0IiwidGVzdCIsInBhcnQiLCJzbGljZSIsIm9wdGlvbmFsIiwibXVsdGlwbGUiLCJFcnJvciIsImZldGNoTWF0Y2giLCJ0b2tlbiIsImxleGljYWxFbGVtZW50cyIsImN1cnJlbnRUYWdJbmRleGVzIiwiY3VycmVudFRhZ05hbWUiLCJpbmRleCIsInBvcCIsInB1c2giLCJjb21waWxlU3RhdGVtZW50Iiwib3V0cHV0IiwiZ3JhbW1hciIsIm5ld1J1bGUiLCJzdGF0ZW1lbnQiLCJmaW5kIiwidHlwZSIsIm1hdGNoZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBU2dCQSxjLEdBQUFBLGM7a0JBc0dRQyxROztBQS9HeEI7O0FBRUEsSUFBSUMsV0FBVyxFQUFmO0FBQ0EsSUFBSUMsWUFBWSxLQUFoQjtBQUNBLElBQUlDLFlBQVksRUFBRUMsS0FBSyxFQUFQLEVBQVdDLFNBQVMsRUFBcEIsRUFBaEI7QUFDQSxJQUFNQyxjQUFjLEVBQXBCOztBQUVBLElBQUlDLGdCQUFnQixFQUFwQjs7QUFFTyxTQUFTUixjQUFULENBQXdCUyxTQUF4QixFQUFtQztBQUN4QyxNQUFJLENBQUNBLFNBQUwsRUFBZ0IsT0FBTyxJQUFQOztBQUVoQkMsU0FBT0MsSUFBUCxDQUFZRixTQUFaLEVBQXVCRyxPQUF2QixDQUErQixVQUFDQyxHQUFELEVBQVM7QUFDdEMsb0JBQWVKLFVBQVVJLEdBQVYsQ0FBZjtBQUNFLFdBQUssUUFBTDtBQUNFSixrQkFBVUks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O0FBRXpDO0FBQ0EsTUFBSUEsY0FBYyxJQUFkLElBQXNCQyxVQUFVRSxPQUFWLEtBQXNCLEdBQWhELEVBQXFEO0FBQ25ELFFBQUlxQixNQUFNckIsT0FBTixLQUFrQixHQUF0QixFQUEyQkgsWUFBWSxXQUFaLENBQTNCLEtBQ0ssSUFBSXdCLE1BQU1yQixPQUFOLEtBQWtCLEdBQXRCLEVBQTJCSCxZQUFZLFFBQVosQ0FBM0IsS0FDQTtBQUFFO0FBQ0xBLGtCQUFZLEtBQVo7QUFDQSxnQ0FBY2dDLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkIsUUFBM0IsRUFBcUNqQyxTQUFTZ0IsTUFBOUM7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSSxDQUFDZixTQUFELElBQWN3QixNQUFNdEIsR0FBTixLQUFjLEtBQWhDLEVBQXVDO0FBQ3JDLFFBQUksQ0FBQytCLFFBQVEzQixTQUFiLEVBQXdCLDBCQUFjMEIsTUFBZCxFQUFzQlIsTUFBTXJCLE9BQTVCLEVBQXFDcUIsTUFBTXRCLEdBQTNDLEVBQWdESCxTQUFTZ0IsTUFBekQsRUFBeEIsS0FDSztBQUNIZ0IsdUJBQWlCQyxNQUFqQixFQUF5QlIsS0FBekIsRUFBZ0NTLE9BQWhDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJakMsY0FBYyxXQUFkLElBQTZCQyxVQUFVRSxPQUFWLEtBQXNCLEdBQW5ELElBQTBEcUIsTUFBTXJCLE9BQU4sS0FBa0IsR0FBaEYsRUFBcUZILFlBQVksS0FBWixDQTlCOUIsQ0E4QmlEO0FBQ3hHLE1BQUlBLGNBQWMsUUFBZCxJQUEwQndCLE1BQU10QixHQUFOLEtBQWMsS0FBNUMsRUFBbURGLFlBQVksS0FBWixDQS9CSSxDQStCZTs7QUFFdEVDLGNBQVl1QixLQUFaO0FBQ0EsU0FBTyxJQUFQO0FBQ0QiLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB3cml0ZVdpdGhUYWdzLCBvcGVuVGFnLCBjbG9zZVRhZywgdGVzdFJ1bGUgfSBmcm9tICcuL3V0aWxzJztcblxubGV0IG9wZW5UYWdzID0gW107XG5sZXQgaXNDb21tZW50ID0gZmFsc2U7XG5sZXQgcHJldlRva2VuID0geyB0YWc6ICcnLCBjb250ZW50OiAnJyB9O1xuY29uc3QgcnVsZUluZGV4ZXMgPSBbXTtcblxubGV0IGluZGV4U25hcHNob3QgPSBbXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3RydWN0dXJlKHN0cnVjdHVyZSkge1xuICBpZiAoIXN0cnVjdHVyZSkgcmV0dXJuIG51bGw7XG5cbiAgT2JqZWN0LmtleXMoc3RydWN0dXJlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBzdHJ1Y3R1cmVba2V5XSkge1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgc3RydWN0dXJlW2tleV0gPSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICBwYXJ0czogc3RydWN0dXJlW2tleV0ubWFwKChzdHIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RDaGFyID0gc3RyW3N0ci5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHBhcnRzOiBzdHIuc3BsaXQoJyEnKS5tYXAocGFydCA9PiAvXFwqfFxcPy8udGVzdChwYXJ0W3BhcnQubGVuZ3RoIC0gMV0pID8gcGFydC5zbGljZSgwLCBwYXJ0Lmxlbmd0aCAtIDEpIDogcGFydCksXG4gICAgICAgICAgICAgIG9wdGlvbmFsOiBsYXN0Q2hhciA9PT0gJz8nLFxuICAgICAgICAgICAgICBtdWx0aXBsZTogbGFzdENoYXIgPT09ICcqJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICAgIG11bHRpcGxlOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBzdHJ1Y3R1cmVba2V5XSA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIHBhcnRzOiBzdHJ1Y3R1cmVba2V5XS5zcGxpdCgnIScpLm1hcChwYXJ0ID0+IC9cXCp8XFw/Ly50ZXN0KHBhcnRbcGFydC5sZW5ndGggLSAxXSkgPyBwYXJ0LnNsaWNlKDAsIHBhcnQubGVuZ3RoIC0gMSkgOiBwYXJ0KSxcbiAgICAgICAgICBvcHRpb25hbDogc3RydWN0dXJlW2tleV1bc3RydWN0dXJlW2tleV0ubGVuZ3RoIC0gMV0gPT09ICc/JyxcbiAgICAgICAgICBtdWx0aXBsZTogc3RydWN0dXJlW2tleV1bc3RydWN0dXJlW2tleV0ubGVuZ3RoIC0gMV0gPT09ICcqJyxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcnVsZS4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzdHJ1Y3R1cmU7XG59XG5cbmZ1bmN0aW9uIGZldGNoTWF0Y2godG9rZW4sIHsgc3RydWN0dXJlLCBsZXhpY2FsRWxlbWVudHMgfSkge1xuICAvLyBHZXQgdGhlIGxhc3QgaW5kZXhcbiAgY29uc3QgY3VycmVudFRhZ0luZGV4ZXMgPSBydWxlSW5kZXhlc1tydWxlSW5kZXhlcy5sZW5ndGggLSAxXTtcblxuICAvLyBHZXQgdGhlIGN1cnJlbnQgdGFnXG4gIGNvbnN0IGN1cnJlbnRUYWdOYW1lID0gb3BlblRhZ3NbcnVsZUluZGV4ZXMubGVuZ3RoXS50YWc7XG5cbiAgbGV0IHN0ciA9IGN1cnJlbnRUYWdOYW1lO1xuICBsZXQgb3B0aW9uYWwgPSBmYWxzZTtcbiAgbGV0IG11bHRpcGxlID0gZmFsc2U7XG5cbiAgY3VycmVudFRhZ0luZGV4ZXMuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICBzdHIgPSBzdHJ1Y3R1cmVbc3RyXSA/IHN0cnVjdHVyZVtzdHJdLnBhcnRzW2luZGV4XSA6IHN0ci5wYXJ0c1tpbmRleF07XG4gICAgaWYgKCFvcHRpb25hbCkge1xuICAgICAgb3B0aW9uYWwgPSBzdHJ1Y3R1cmVbc3RyXSA/IHN0cnVjdHVyZVtzdHJdLm9wdGlvbmFsIDogc3RyICYmIHN0ci5vcHRpb25hbDtcbiAgICB9XG4gICAgaWYgKCFtdWx0aXBsZSkge1xuICAgICAgbXVsdGlwbGUgPSBzdHJ1Y3R1cmVbc3RyXSA/IHN0cnVjdHVyZVtzdHJdLm11bHRpcGxlIDogc3RyICYmIHN0ci5tdWx0aXBsZTtcbiAgICAgIGlmIChtdWx0aXBsZSkgaW5kZXhTbmFwc2hvdCA9IHJ1bGVJbmRleGVzO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFzdHIpIHtcbiAgICBjdXJyZW50VGFnSW5kZXhlcy5wb3AoKTtcbiAgICBjdXJyZW50VGFnSW5kZXhlc1tjdXJyZW50VGFnSW5kZXhlcy5sZW5ndGggLSAxXSArPSAxO1xuICAgIHJldHVybiBmZXRjaE1hdGNoKHRva2VuLCB7IHN0cnVjdHVyZSwgbGV4aWNhbEVsZW1lbnRzIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnIHx8IHN0cnVjdHVyZVtzdHJdKSB7XG4gICAgY3VycmVudFRhZ0luZGV4ZXMucHVzaCgwKTtcbiAgICByZXR1cm4gZmV0Y2hNYXRjaCh0b2tlbiwgeyBzdHJ1Y3R1cmUsIGxleGljYWxFbGVtZW50cyB9KTtcbiAgfVxuXG4gIGlmICghbXVsdGlwbGUpIHtcbiAgICBjdXJyZW50VGFnSW5kZXhlc1tjdXJyZW50VGFnSW5kZXhlcy5sZW5ndGggLSAxXSArPSAxO1xuICB9XG5cbiAgLy8gTGV4aWNhbCBlbGVtZW50IG1hdGNoXG4gIGlmIChzdHIgPT09IHRva2VuLmNvbnRlbnQgfHwgKGxleGljYWxFbGVtZW50c1tzdHJdICYmIHRlc3RSdWxlKHRva2VuLCBsZXhpY2FsRWxlbWVudHNbc3RyXSkpKSB7XG4gICAgb3BlblRhZ3NbcnVsZUluZGV4ZXMubGVuZ3RoXS5jb250ZW50LnB1c2godG9rZW4pO1xuICAgIHJldHVybiB0b2tlbjtcbiAgfSBlbHNlIGlmIChtdWx0aXBsZSkgeyAvLyBObyBtYXRjaCBhbmQgbXVsdGlwbGVcbiAgICBjdXJyZW50VGFnSW5kZXhlc1tjdXJyZW50VGFnSW5kZXhlcy5sZW5ndGggLSAxXSArPSAxO1xuICAgIHJldHVybiBmZXRjaE1hdGNoKHRva2VuLCB7IHN0cnVjdHVyZSwgbGV4aWNhbEVsZW1lbnRzIH0pO1xuICB9IGVsc2UgaWYgKG9wdGlvbmFsKSB7XG4gICAgcmV0dXJuIGZldGNoTWF0Y2godG9rZW4sIHsgc3RydWN0dXJlLCBsZXhpY2FsRWxlbWVudHMgfSk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gQ29tcGlsZXMgYSBydWxlXG5mdW5jdGlvbiBjb21waWxlU3RhdGVtZW50KG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpIHtcbiAgY29uc3QgeyBzdHJ1Y3R1cmUgfSA9IGdyYW1tYXI7XG5cbiAgaWYgKCFydWxlSW5kZXhlcy5sZW5ndGgpIHsgLy8gTm8gY3VycmVudCBydWxlXG4gICAgY29uc3QgbmV3UnVsZSA9IHN0cnVjdHVyZS5zdGF0ZW1lbnQucGFydHNbMF0uc3BsaXQoJ3wnKS5maW5kKHR5cGUgPT4gc3RydWN0dXJlW3R5cGVdLnBhcnRzWzBdLnBhcnRzWzBdLnNwbGl0KCd8JykuZmluZChzdHIgPT4gc3RyID09PSB0b2tlbi5jb250ZW50KSk7XG5cbiAgICBpZiAobmV3UnVsZSkge1xuICAgICAgb3BlblRhZ3MucHVzaCh7IHRhZzogbmV3UnVsZSwgY29udGVudDogW3Rva2VuXSB9KTtcbiAgICAgIHJ1bGVJbmRleGVzLnB1c2goWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBtYXRjaGVkID0gZmV0Y2hNYXRjaCh0b2tlbiwgZ3JhbW1hcik7XG59XG5cbi8vIERyaXZlcyBjb21waWxlciBsb2dpYy4gU2tpcHMgY29tbWVudHMgYW5kIGNoZWNrcyBpZiBpbiBzdHJ1Y3R1cmUgb3IgdG9rZW4gbW9kZVxuLy8gVE9ETzogT3B0aW1pemUgYnkgcmVtb3ZpbmcgdW5uZWNlc2FyeSBjaGVja3NcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBpbGVyKG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpIHtcbiAgaWYgKCF0b2tlbikgeyAvLyBFbmQgb2YgZmlsZVxuICAgIG9wZW5UYWdzID0gW107XG4gICAgcmV0dXJuIGNsb3NlVGFnKG91dHB1dCwgJ3Rva2VucycpO1xuICB9IGVsc2UgaWYgKCFvcGVuVGFncy5sZW5ndGgpIHsgLy8gRmlyc3QgdG9rZW5cbiAgICBvcGVuVGFncy5wdXNoKHsgdGFnOiAndG9rZW5zJyB9KTtcbiAgICBvcGVuVGFnKG91dHB1dCwgJ3Rva2VucycpO1xuICB9XG5cbiAgLy8gUG9zc2libGUgY29tbWVudFxuICBpZiAoIWlzQ29tbWVudCAmJiB0b2tlbi5jb250ZW50ID09PSAnLycpIGlzQ29tbWVudCA9IHRydWU7XG5cbiAgLy8gQ2hlY2sgaWYgaXQncyByZWFsbHkgYSBjb21tZW50XG4gIGlmIChpc0NvbW1lbnQgPT09IHRydWUgJiYgcHJldlRva2VuLmNvbnRlbnQgPT09ICcvJykge1xuICAgIGlmICh0b2tlbi5jb250ZW50ID09PSAnKicpIGlzQ29tbWVudCA9ICdtdWx0aWxpbmUnO1xuICAgIGVsc2UgaWYgKHRva2VuLmNvbnRlbnQgPT09ICcvJykgaXNDb21tZW50ID0gJ2lubGluZSc7XG4gICAgZWxzZSB7IC8vIFdhcyBub3QgYSBjb21tZW50XG4gICAgICBpc0NvbW1lbnQgPSBmYWxzZTtcbiAgICAgIHdyaXRlV2l0aFRhZ3Mob3V0cHV0LCAnLycsICdzeW1ib2wnLCBvcGVuVGFncy5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdyaXRlIGlmIGl0J3Mgbm90IGEgbmV3bGluZSBjaGFyYWN0ZXIgb3IgcGFydCBvZiBhIGNvbW1lbnRcbiAgaWYgKCFpc0NvbW1lbnQgJiYgdG9rZW4udGFnICE9PSAnZW9sJykge1xuICAgIGlmICghZ3JhbW1hci5zdHJ1Y3R1cmUpIHdyaXRlV2l0aFRhZ3Mob3V0cHV0LCB0b2tlbi5jb250ZW50LCB0b2tlbi50YWcsIG9wZW5UYWdzLmxlbmd0aCk7XG4gICAgZWxzZSB7XG4gICAgICBjb21waWxlU3RhdGVtZW50KG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0NvbW1lbnQgPT09ICdtdWx0aWxpbmUnICYmIHByZXZUb2tlbi5jb250ZW50ID09PSAnKicgJiYgdG9rZW4uY29udGVudCA9PT0gJy8nKSBpc0NvbW1lbnQgPSBmYWxzZTsgLy8gRW5kIG9mIG11bHRpbGluZSBjb21tZW50P1xuICBpZiAoaXNDb21tZW50ID09PSAnaW5saW5lJyAmJiB0b2tlbi50YWcgPT09ICdlb2wnKSBpc0NvbW1lbnQgPSBmYWxzZTsgLy8gRW5kIG9mIGlubGluZSBjb21tZW50P1xuXG4gIHByZXZUb2tlbiA9IHRva2VuO1xuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==