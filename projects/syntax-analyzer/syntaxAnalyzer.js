'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function analyze(filePath, lexicalElements, grammar) {
  var sourceFiles = void 0;

  // Get source file or source files in directory
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

  // Compile each source file
  sourceFiles.forEach(function (sourceFile) {
    var input = _fs2.default.openSync(sourceFile, 'r');
    var output = _fs2.default.openSync(sourceFile.slice(0, sourceFile.lastIndexOf('.')) + '.xml', 'w');

    var token = (0, _tokenizer2.default)(input, lexicalElements);
    while (token) {
      (0, _compiler2.default)(output, token, grammar);
      token = (0, _tokenizer2.default)(input, lexicalElements);
    }
    (0, _compiler2.default)(output, token, grammar);
  });
}

var lexicalElements = {
  keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
  symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
  integerConstant: function integerConstant(n) {
    return Number(n) >= 0 && Number(n) <= 32767;
  },
  identifier: /^\D\w*/,
  stringConstant: function stringConstant(s) {
    return !s.includes('"') && !s.includes('\n');
  }
};

analyze(process.argv[2], lexicalElements, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zeW50YXgtYW5hbHl6ZXIvc3ludGF4QW5hbHl6ZXIuanMiXSwibmFtZXMiOlsiYW5hbHl6ZSIsImZpbGVQYXRoIiwibGV4aWNhbEVsZW1lbnRzIiwiZ3JhbW1hciIsInNvdXJjZUZpbGVzIiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsInJlYWRkaXJTeW5jIiwiZmlsdGVyIiwiZmlsZSIsIm1hcCIsInJlc29sdmUiLCJjb25zb2xlIiwibG9nIiwiZm9yRWFjaCIsInNvdXJjZUZpbGUiLCJpbnB1dCIsIm9wZW5TeW5jIiwib3V0cHV0IiwidG9rZW4iLCJrZXl3b3JkIiwic3ltYm9sIiwiaW50ZWdlckNvbnN0YW50IiwiTnVtYmVyIiwibiIsImlkZW50aWZpZXIiLCJzdHJpbmdDb25zdGFudCIsInMiLCJpbmNsdWRlcyIsInByb2Nlc3MiLCJhcmd2Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxPQUFULENBQWlCQyxRQUFqQixFQUEyQkMsZUFBM0IsRUFBNENDLE9BQTVDLEVBQXFEO0FBQ25ELE1BQUlDLG9CQUFKOztBQUVBO0FBQ0EsTUFBSUgsU0FBU0ksS0FBVCxDQUFlSixTQUFTSyxXQUFULENBQXFCLEdBQXJCLENBQWYsTUFBOEMsT0FBbEQsRUFBMkQ7QUFDekRGLGtCQUFjLENBQUNILFFBQUQsQ0FBZDtBQUNELEdBRkQsTUFFTztBQUNMRyxrQkFBYyxhQUFHRyxXQUFILENBQWVOLFFBQWYsRUFBeUJPLE1BQXpCLENBQWdDO0FBQUEsYUFBUUMsS0FBSyxDQUFMLE1BQVksR0FBWixJQUFtQkEsS0FBS0osS0FBTCxDQUFXSSxLQUFLSCxXQUFMLENBQWlCLEdBQWpCLENBQVgsTUFBc0MsT0FBakU7QUFBQSxLQUFoQyxFQUNiSSxHQURhLENBQ1Q7QUFBQSxhQUFRLGVBQUtDLE9BQUwsQ0FBYVYsUUFBYixFQUF1QlEsSUFBdkIsQ0FBUjtBQUFBLEtBRFMsQ0FBZDtBQUVEOztBQUVERyxVQUFRQyxHQUFSLGlCQUEwQlQsV0FBMUI7O0FBRUE7QUFDQUEsY0FBWVUsT0FBWixDQUFvQixVQUFDQyxVQUFELEVBQWdCO0FBQ2xDLFFBQU1DLFFBQVEsYUFBR0MsUUFBSCxDQUFZRixVQUFaLEVBQXdCLEdBQXhCLENBQWQ7QUFDQSxRQUFNRyxTQUFTLGFBQUdELFFBQUgsQ0FBZUYsV0FBV1YsS0FBWCxDQUFpQixDQUFqQixFQUFvQlUsV0FBV1QsV0FBWCxDQUF1QixHQUF2QixDQUFwQixDQUFmLFdBQXVFLEdBQXZFLENBQWY7O0FBRUEsUUFBSWEsUUFBUSx5QkFBUUgsS0FBUixFQUFlZCxlQUFmLENBQVo7QUFDQSxXQUFPaUIsS0FBUCxFQUFjO0FBQ1osOEJBQVFELE1BQVIsRUFBZ0JDLEtBQWhCLEVBQXVCaEIsT0FBdkI7QUFDQWdCLGNBQVEseUJBQVFILEtBQVIsRUFBZWQsZUFBZixDQUFSO0FBQ0Q7QUFDRCw0QkFBUWdCLE1BQVIsRUFBZ0JDLEtBQWhCLEVBQXVCaEIsT0FBdkI7QUFDRCxHQVZEO0FBV0Q7O0FBRUQsSUFBTUQsa0JBQWtCO0FBQ3RCa0IsV0FBUyxDQUFDLE9BQUQsRUFBVSxhQUFWLEVBQXlCLFVBQXpCLEVBQXFDLFFBQXJDLEVBQStDLE9BQS9DLEVBQXdELFFBQXhELEVBQWtFLEtBQWxFLEVBQXlFLEtBQXpFLEVBQWdGLE1BQWhGLEVBQ1AsU0FETyxFQUNJLE1BREosRUFDWSxNQURaLEVBQ29CLE9BRHBCLEVBQzZCLE1BRDdCLEVBQ3FDLE1BRHJDLEVBQzZDLEtBRDdDLEVBQ29ELElBRHBELEVBQzBELElBRDFELEVBQ2dFLE1BRGhFLEVBQ3dFLE9BRHhFLEVBQ2lGLFFBRGpGLENBRGE7QUFHdEJDLFVBQVEsZ0RBSGM7QUFJdEJDLG1CQUFpQjtBQUFBLFdBQUtDLE9BQU9DLENBQVAsS0FBYSxDQUFiLElBQWtCRCxPQUFPQyxDQUFQLEtBQWEsS0FBcEM7QUFBQSxHQUpLO0FBS3RCQyxjQUFZLFFBTFU7QUFNdEJDLGtCQUFnQjtBQUFBLFdBQUssQ0FBQ0MsRUFBRUMsUUFBRixDQUFXLEdBQVgsQ0FBRCxJQUFvQixDQUFDRCxFQUFFQyxRQUFGLENBQVcsSUFBWCxDQUExQjtBQUFBO0FBTk0sQ0FBeEI7O0FBU0E1QixRQUFRNkIsUUFBUUMsSUFBUixDQUFhLENBQWIsQ0FBUixFQUF5QjVCLGVBQXpCLEVBQTBDLEtBQTFDIiwiZmlsZSI6InN5bnRheEFuYWx5emVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgYWR2YW5jZSBmcm9tICcuL3Rva2VuaXplcic7XG5pbXBvcnQgY29tcGlsZSBmcm9tICcuL2NvbXBpbGVyJztcblxuZnVuY3Rpb24gYW5hbHl6ZShmaWxlUGF0aCwgbGV4aWNhbEVsZW1lbnRzLCBncmFtbWFyKSB7XG4gIGxldCBzb3VyY2VGaWxlcztcblxuICAvLyBHZXQgc291cmNlIGZpbGUgb3Igc291cmNlIGZpbGVzIGluIGRpcmVjdG9yeVxuICBpZiAoZmlsZVBhdGguc2xpY2UoZmlsZVBhdGgubGFzdEluZGV4T2YoJy4nKSkgPT09ICcuamFjaycpIHtcbiAgICBzb3VyY2VGaWxlcyA9IFtmaWxlUGF0aF07XG4gIH0gZWxzZSB7XG4gICAgc291cmNlRmlsZXMgPSBmcy5yZWFkZGlyU3luYyhmaWxlUGF0aCkuZmlsdGVyKGZpbGUgPT4gZmlsZVswXSAhPT0gJy4nICYmIGZpbGUuc2xpY2UoZmlsZS5sYXN0SW5kZXhPZignLicpKSA9PT0gJy5qYWNrJylcbiAgICAubWFwKGZpbGUgPT4gcGF0aC5yZXNvbHZlKGZpbGVQYXRoLCBmaWxlKSk7XG4gIH1cblxuICBjb25zb2xlLmxvZyhgQ29tcGlsaW5nOiAke3NvdXJjZUZpbGVzfWApO1xuXG4gIC8vIENvbXBpbGUgZWFjaCBzb3VyY2UgZmlsZVxuICBzb3VyY2VGaWxlcy5mb3JFYWNoKChzb3VyY2VGaWxlKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBmcy5vcGVuU3luYyhzb3VyY2VGaWxlLCAncicpO1xuICAgIGNvbnN0IG91dHB1dCA9IGZzLm9wZW5TeW5jKGAke3NvdXJjZUZpbGUuc2xpY2UoMCwgc291cmNlRmlsZS5sYXN0SW5kZXhPZignLicpKX0ueG1sYCwgJ3cnKTtcblxuICAgIGxldCB0b2tlbiA9IGFkdmFuY2UoaW5wdXQsIGxleGljYWxFbGVtZW50cyk7XG4gICAgd2hpbGUgKHRva2VuKSB7XG4gICAgICBjb21waWxlKG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpO1xuICAgICAgdG9rZW4gPSBhZHZhbmNlKGlucHV0LCBsZXhpY2FsRWxlbWVudHMpO1xuICAgIH1cbiAgICBjb21waWxlKG91dHB1dCwgdG9rZW4sIGdyYW1tYXIpO1xuICB9KTtcbn1cblxuY29uc3QgbGV4aWNhbEVsZW1lbnRzID0ge1xuICBrZXl3b3JkOiBbJ2NsYXNzJywgJ2NvbnN0cnVjdG9yJywgJ2Z1bmN0aW9uJywgJ21ldGhvZCcsICdmaWVsZCcsICdzdGF0aWMnLCAndmFyJywgJ2ludCcsICdjaGFyJyxcbiAgICAnYm9vbGVhbicsICd2b2lkJywgJ3RydWUnLCAnZmFsc2UnLCAnbnVsbCcsICd0aGlzJywgJ2xldCcsICdkbycsICdpZicsICdlbHNlJywgJ3doaWxlJywgJ3JldHVybiddLFxuICBzeW1ib2w6IC97fH18XFwofFxcKXxcXFt8XFxdfFxcLnwsfDt8XFwrfC18XFwqfFxcL3wmfFxcfHw8fD58PXx+LyxcbiAgaW50ZWdlckNvbnN0YW50OiBuID0+IE51bWJlcihuKSA+PSAwICYmIE51bWJlcihuKSA8PSAzMjc2NyxcbiAgaWRlbnRpZmllcjogL15cXERcXHcqLyxcbiAgc3RyaW5nQ29uc3RhbnQ6IHMgPT4gIXMuaW5jbHVkZXMoJ1wiJykgJiYgIXMuaW5jbHVkZXMoJ1xcbicpLFxufTtcblxuYW5hbHl6ZShwcm9jZXNzLmFyZ3ZbMl0sIGxleGljYWxFbGVtZW50cywgZmFsc2UpO1xuIl19