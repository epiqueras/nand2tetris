'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compiler;

var _utils = require('./utils');

var openTags = [];
var isComment = false;
var prevToken = { tag: '', content: '' };
var currentStatement = '';

// Drives compiler logic. Skips comments and checks if in grammar or token mode
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
    if (!grammar) (0, _utils.writeWithTags)(output, token.content, token.tag, openTags.length);
    // else {
    //   compileStatement(output, token, grammar);
    // }
  }

  if (isComment === 'multiline' && prevToken.content === '*' && token.content === '/') isComment = false; // End of multiline comment?
  if (isComment === 'inline' && token.tag === 'eol') isComment = false; // End of inline comment?

  prevToken = token;
  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zeW50YXgtYW5hbHl6ZXIvY29tcGlsZXIuanMiXSwibmFtZXMiOlsiY29tcGlsZXIiLCJvcGVuVGFncyIsImlzQ29tbWVudCIsInByZXZUb2tlbiIsInRhZyIsImNvbnRlbnQiLCJjdXJyZW50U3RhdGVtZW50Iiwib3V0cHV0IiwidG9rZW4iLCJncmFtbWFyIiwibGVuZ3RoIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBU3dCQSxROztBQVR4Qjs7QUFFQSxJQUFJQyxXQUFXLEVBQWY7QUFDQSxJQUFJQyxZQUFZLEtBQWhCO0FBQ0EsSUFBSUMsWUFBWSxFQUFFQyxLQUFLLEVBQVAsRUFBV0MsU0FBUyxFQUFwQixFQUFoQjtBQUNBLElBQUlDLG1CQUFtQixFQUF2Qjs7QUFFQTtBQUNBO0FBQ2UsU0FBU04sUUFBVCxDQUFrQk8sTUFBbEIsRUFBMEJDLEtBQTFCLEVBQWlDQyxPQUFqQyxFQUEwQztBQUN2RCxNQUFJLENBQUNELEtBQUwsRUFBWTtBQUFFO0FBQ1pQLGVBQVcsRUFBWDtBQUNBLFdBQU8scUJBQVNNLE1BQVQsRUFBaUIsUUFBakIsQ0FBUDtBQUNELEdBSEQsTUFHTyxJQUFJLENBQUNOLFNBQVNTLE1BQWQsRUFBc0I7QUFBRTtBQUM3QlQsYUFBU1UsSUFBVCxDQUFjLEVBQUVQLEtBQUssUUFBUCxFQUFkO0FBQ0Esd0JBQVFHLE1BQVIsRUFBZ0IsUUFBaEI7QUFDRDs7QUFFRDtBQUNBLE1BQUksQ0FBQ0wsU0FBRCxJQUFjTSxNQUFNSCxPQUFOLEtBQWtCLEdBQXBDLEVBQXlDSCxZQUFZLElBQVo7O0FBRXpDO0FBQ0EsTUFBSUEsY0FBYyxJQUFkLElBQXNCQyxVQUFVRSxPQUFWLEtBQXNCLEdBQWhELEVBQXFEO0FBQ25ELFFBQUlHLE1BQU1ILE9BQU4sS0FBa0IsR0FBdEIsRUFBMkJILFlBQVksV0FBWixDQUEzQixLQUNLLElBQUlNLE1BQU1ILE9BQU4sS0FBa0IsR0FBdEIsRUFBMkJILFlBQVksUUFBWixDQUEzQixLQUNBO0FBQUU7QUFDTEEsa0JBQVksS0FBWjtBQUNBLGdDQUFjSyxNQUFkLEVBQXNCLEdBQXRCLEVBQTJCLFFBQTNCLEVBQXFDTixTQUFTUyxNQUE5QztBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxNQUFJLENBQUNSLFNBQUQsSUFBY00sTUFBTUosR0FBTixLQUFjLEtBQWhDLEVBQXVDO0FBQ3JDLFFBQUksQ0FBQ0ssT0FBTCxFQUFjLDBCQUFjRixNQUFkLEVBQXNCQyxNQUFNSCxPQUE1QixFQUFxQ0csTUFBTUosR0FBM0MsRUFBZ0RILFNBQVNTLE1BQXpEO0FBQ2Q7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsTUFBSVIsY0FBYyxXQUFkLElBQTZCQyxVQUFVRSxPQUFWLEtBQXNCLEdBQW5ELElBQTBERyxNQUFNSCxPQUFOLEtBQWtCLEdBQWhGLEVBQXFGSCxZQUFZLEtBQVosQ0E5QjlCLENBOEJpRDtBQUN4RyxNQUFJQSxjQUFjLFFBQWQsSUFBMEJNLE1BQU1KLEdBQU4sS0FBYyxLQUE1QyxFQUFtREYsWUFBWSxLQUFaLENBL0JJLENBK0JlOztBQUV0RUMsY0FBWUssS0FBWjtBQUNBLFNBQU8sSUFBUDtBQUNEIiwiZmlsZSI6ImNvbXBpbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd3JpdGVXaXRoVGFncywgb3BlblRhZywgY2xvc2VUYWcgfSBmcm9tICcuL3V0aWxzJztcblxubGV0IG9wZW5UYWdzID0gW107XG5sZXQgaXNDb21tZW50ID0gZmFsc2U7XG5sZXQgcHJldlRva2VuID0geyB0YWc6ICcnLCBjb250ZW50OiAnJyB9O1xubGV0IGN1cnJlbnRTdGF0ZW1lbnQgPSAnJztcblxuLy8gRHJpdmVzIGNvbXBpbGVyIGxvZ2ljLiBTa2lwcyBjb21tZW50cyBhbmQgY2hlY2tzIGlmIGluIGdyYW1tYXIgb3IgdG9rZW4gbW9kZVxuLy8gVE9ETzogT3B0aW1pemUgYnkgcmVtb3ZpbmcgdW5uZWNlc2FyeSBjaGVja3NcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBpbGVyKG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpIHtcbiAgaWYgKCF0b2tlbikgeyAvLyBFbmQgb2YgZmlsZVxuICAgIG9wZW5UYWdzID0gW107XG4gICAgcmV0dXJuIGNsb3NlVGFnKG91dHB1dCwgJ3Rva2VucycpO1xuICB9IGVsc2UgaWYgKCFvcGVuVGFncy5sZW5ndGgpIHsgLy8gRmlyc3QgdG9rZW5cbiAgICBvcGVuVGFncy5wdXNoKHsgdGFnOiAndG9rZW5zJyB9KTtcbiAgICBvcGVuVGFnKG91dHB1dCwgJ3Rva2VucycpO1xuICB9XG5cbiAgLy8gUG9zc2libGUgY29tbWVudFxuICBpZiAoIWlzQ29tbWVudCAmJiB0b2tlbi5jb250ZW50ID09PSAnLycpIGlzQ29tbWVudCA9IHRydWU7XG5cbiAgLy8gQ2hlY2sgaWYgaXQncyByZWFsbHkgYSBjb21tZW50XG4gIGlmIChpc0NvbW1lbnQgPT09IHRydWUgJiYgcHJldlRva2VuLmNvbnRlbnQgPT09ICcvJykge1xuICAgIGlmICh0b2tlbi5jb250ZW50ID09PSAnKicpIGlzQ29tbWVudCA9ICdtdWx0aWxpbmUnO1xuICAgIGVsc2UgaWYgKHRva2VuLmNvbnRlbnQgPT09ICcvJykgaXNDb21tZW50ID0gJ2lubGluZSc7XG4gICAgZWxzZSB7IC8vIFdhcyBub3QgYSBjb21tZW50XG4gICAgICBpc0NvbW1lbnQgPSBmYWxzZTtcbiAgICAgIHdyaXRlV2l0aFRhZ3Mob3V0cHV0LCAnLycsICdzeW1ib2wnLCBvcGVuVGFncy5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdyaXRlIGlmIGl0J3Mgbm90IGEgbmV3bGluZSBjaGFyYWN0ZXIgb3IgcGFydCBvZiBhIGNvbW1lbnRcbiAgaWYgKCFpc0NvbW1lbnQgJiYgdG9rZW4udGFnICE9PSAnZW9sJykge1xuICAgIGlmICghZ3JhbW1hcikgd3JpdGVXaXRoVGFncyhvdXRwdXQsIHRva2VuLmNvbnRlbnQsIHRva2VuLnRhZywgb3BlblRhZ3MubGVuZ3RoKTtcbiAgICAvLyBlbHNlIHtcbiAgICAvLyAgIGNvbXBpbGVTdGF0ZW1lbnQob3V0cHV0LCB0b2tlbiwgZ3JhbW1hcik7XG4gICAgLy8gfVxuICB9XG5cbiAgaWYgKGlzQ29tbWVudCA9PT0gJ211bHRpbGluZScgJiYgcHJldlRva2VuLmNvbnRlbnQgPT09ICcqJyAmJiB0b2tlbi5jb250ZW50ID09PSAnLycpIGlzQ29tbWVudCA9IGZhbHNlOyAvLyBFbmQgb2YgbXVsdGlsaW5lIGNvbW1lbnQ/XG4gIGlmIChpc0NvbW1lbnQgPT09ICdpbmxpbmUnICYmIHRva2VuLnRhZyA9PT0gJ2VvbCcpIGlzQ29tbWVudCA9IGZhbHNlOyAvLyBFbmQgb2YgaW5saW5lIGNvbW1lbnQ/XG5cbiAgcHJldlRva2VuID0gdG9rZW47XG4gIHJldHVybiBudWxsO1xufVxuIl19