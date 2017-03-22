'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function analyze(filePath, grammar) {
  var sourceFiles = void 0;
  var parsedGrammar = _extends({}, grammar, { structure: (0, _compiler.parseStructure)(grammar.structure) });

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

    var token = (0, _tokenizer2.default)(input, parsedGrammar.lexicalElements);
    while (token) {
      (0, _compiler2.default)(output, token, parsedGrammar);
      token = (0, _tokenizer2.default)(input, parsedGrammar.lexicalElements);
    }
    (0, _compiler2.default)(output, token);
  });
}

var grammar = {
  structure: {
    statement: 'letStatement|ifStatement|whileStatement|doStatement|returnStatement|classDec',
    letStatement: ['let', 'varName', '[!expression!]?', '=', 'expression', ';'],
    ifStatement: ['if', '(', 'expression', ')', '{', 'statements', '}', 'else!{!statements!}?'],
    whileStatement: ['while', '(', 'expression', ')', '{', 'statements', '}'],
    doStatement: ['do', 'subroutineCall', ';'],
    returnStatement: ['return', 'expression?', ';'],
    classDec: ['class', 'className', '{', 'classVarDec*', 'subRoutineDec*', '}'],
    classVarDec: ['static|field', 'type', 'varName', ',!varName*', ';'],
    type: 'int|char|boolean|className',
    subroutineDec: ['constructor|function|method', 'void|type', 'subroutineName', '(', 'parameterList?', ')', 'subroutineBody'],
    parameterList: ['type', 'varName', ',!type!varName*'],
    subroutineBody: ['{', 'varDec*', 'statements', '}'],
    varDec: ['var', 'type', 'varName', ',!varName*', ';'],
    className: 'identifier',
    subroutineName: 'identifier',
    varName: 'identifier',
    expression: ['term', 'op!term*'],
    term: 'integerConstant|stringConstant|keywordConstant|varName|varName![!expression!]|subroutineCall|(!expression!)|unaryOp!term',
    subroutineCall: 'functionCall|methodCall',
    functionCall: ['subroutineName', '(', 'expressionList?', ')'],
    methodCall: ['className|varName', '.', 'subroutineName', '(', 'expressionList?', ')'],
    expressionList: ['expression', ',!expression*'],
    op: '+|-|*|/|&|||<|>|=',
    unaryOp: '-|~',
    keywordConstant: 'true|false|null|this'
  }, // Looks correct
  lexicalElements: {
    keyword: ['class', 'constructor', 'function', 'method', 'field', 'static', 'var', 'int', 'char', 'boolean', 'void', 'true', 'false', 'null', 'this', 'let', 'do', 'if', 'else', 'while', 'return'],
    symbol: /{|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~/,
    integerConstant: function integerConstant(n) {
      return Number(n) >= 0 && Number(n) <= 32767;
    },
    identifier: /^\D\w*/,
    stringConstant: function stringConstant(s) {
      return !s.includes('"') && !s.includes('\n');
    }
  }
};

analyze(process.argv[2], grammar);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zeW50YXgtYW5hbHl6ZXIvc3ludGF4QW5hbHl6ZXIuanMiXSwibmFtZXMiOlsiYW5hbHl6ZSIsImZpbGVQYXRoIiwiZ3JhbW1hciIsInNvdXJjZUZpbGVzIiwicGFyc2VkR3JhbW1hciIsInN0cnVjdHVyZSIsInNsaWNlIiwibGFzdEluZGV4T2YiLCJyZWFkZGlyU3luYyIsImZpbHRlciIsImZpbGUiLCJtYXAiLCJyZXNvbHZlIiwiY29uc29sZSIsImxvZyIsImZvckVhY2giLCJzb3VyY2VGaWxlIiwiaW5wdXQiLCJvcGVuU3luYyIsIm91dHB1dCIsInRva2VuIiwibGV4aWNhbEVsZW1lbnRzIiwic3RhdGVtZW50IiwibGV0U3RhdGVtZW50IiwiaWZTdGF0ZW1lbnQiLCJ3aGlsZVN0YXRlbWVudCIsImRvU3RhdGVtZW50IiwicmV0dXJuU3RhdGVtZW50IiwiY2xhc3NEZWMiLCJjbGFzc1ZhckRlYyIsInR5cGUiLCJzdWJyb3V0aW5lRGVjIiwicGFyYW1ldGVyTGlzdCIsInN1YnJvdXRpbmVCb2R5IiwidmFyRGVjIiwiY2xhc3NOYW1lIiwic3Vicm91dGluZU5hbWUiLCJ2YXJOYW1lIiwiZXhwcmVzc2lvbiIsInRlcm0iLCJzdWJyb3V0aW5lQ2FsbCIsImZ1bmN0aW9uQ2FsbCIsIm1ldGhvZENhbGwiLCJleHByZXNzaW9uTGlzdCIsIm9wIiwidW5hcnlPcCIsImtleXdvcmRDb25zdGFudCIsImtleXdvcmQiLCJzeW1ib2wiLCJpbnRlZ2VyQ29uc3RhbnQiLCJOdW1iZXIiLCJuIiwiaWRlbnRpZmllciIsInN0cmluZ0NvbnN0YW50IiwicyIsImluY2x1ZGVzIiwicHJvY2VzcyIsImFyZ3YiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsUUFBakIsRUFBMkJDLE9BQTNCLEVBQW9DO0FBQ2xDLE1BQUlDLG9CQUFKO0FBQ0EsTUFBTUMsNkJBQXFCRixPQUFyQixJQUE4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QUFSLENBQWEsQ0FBYixDQUFSLEVBQXlCdkQsT0FBekIiLCJmaWxlIjoic3ludGF4QW5hbHl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBhZHZhbmNlIGZyb20gJy4vdG9rZW5pemVyJztcbmltcG9ydCBjb21waWxlLCB7IHBhcnNlU3RydWN0dXJlIH0gZnJvbSAnLi9jb21waWxlcic7XG5cbmZ1bmN0aW9uIGFuYWx5emUoZmlsZVBhdGgsIGdyYW1tYXIpIHtcbiAgbGV0IHNvdXJjZUZpbGVzO1xuICBjb25zdCBwYXJzZWRHcmFtbWFyID0geyAuLi5ncmFtbWFyLCBzdHJ1Y3R1cmU6IHBhcnNlU3RydWN0dXJlKGdyYW1tYXIuc3RydWN0dXJlKSB9O1xuXG4gIC8vIEdldCBzb3VyY2UgZmlsZSBvciBzb3VyY2UgZmlsZXMgaW4gZGlyZWN0b3J5XG4gIGlmIChmaWxlUGF0aC5zbGljZShmaWxlUGF0aC5sYXN0SW5kZXhPZignLicpKSA9PT0gJy5qYWNrJykge1xuICAgIHNvdXJjZUZpbGVzID0gW2ZpbGVQYXRoXTtcbiAgfSBlbHNlIHtcbiAgICBzb3VyY2VGaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGZpbGVQYXRoKS5maWx0ZXIoZmlsZSA9PiBmaWxlWzBdICE9PSAnLicgJiYgZmlsZS5zbGljZShmaWxlLmxhc3RJbmRleE9mKCcuJykpID09PSAnLmphY2snKVxuICAgIC5tYXAoZmlsZSA9PiBwYXRoLnJlc29sdmUoZmlsZVBhdGgsIGZpbGUpKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGBDb21waWxpbmc6ICR7c291cmNlRmlsZXN9YCk7XG5cbiAgLy8gQ29tcGlsZSBlYWNoIHNvdXJjZSBmaWxlXG4gIHNvdXJjZUZpbGVzLmZvckVhY2goKHNvdXJjZUZpbGUpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGZzLm9wZW5TeW5jKHNvdXJjZUZpbGUsICdyJyk7XG4gICAgY29uc3Qgb3V0cHV0ID0gZnMub3BlblN5bmMoYCR7c291cmNlRmlsZS5zbGljZSgwLCBzb3VyY2VGaWxlLmxhc3RJbmRleE9mKCcuJykpfS54bWxgLCAndycpO1xuXG4gICAgbGV0IHRva2VuID0gYWR2YW5jZShpbnB1dCwgcGFyc2VkR3JhbW1hci5sZXhpY2FsRWxlbWVudHMpO1xuICAgIHdoaWxlICh0b2tlbikge1xuICAgICAgY29tcGlsZShvdXRwdXQsIHRva2VuLCBwYXJzZWRHcmFtbWFyKTtcbiAgICAgIHRva2VuID0gYWR2YW5jZShpbnB1dCwgcGFyc2VkR3JhbW1hci5sZXhpY2FsRWxlbWVudHMpO1xuICAgIH1cbiAgICBjb21waWxlKG91dHB1dCwgdG9rZW4pO1xuICB9KTtcbn1cblxuY29uc3QgZ3JhbW1hciA9IHtcbiAgc3RydWN0dXJlOiB7XG4gICAgc3RhdGVtZW50OiAnbGV0U3RhdGVtZW50fGlmU3RhdGVtZW50fHdoaWxlU3RhdGVtZW50fGRvU3RhdGVtZW50fHJldHVyblN0YXRlbWVudHxjbGFzc0RlYycsXG4gICAgbGV0U3RhdGVtZW50OiBbJ2xldCcsICd2YXJOYW1lJywgJ1shZXhwcmVzc2lvbiFdPycsICc9JywgJ2V4cHJlc3Npb24nLCAnOyddLFxuICAgIGlmU3RhdGVtZW50OiBbJ2lmJywgJygnLCAnZXhwcmVzc2lvbicsICcpJywgJ3snLCAnc3RhdGVtZW50cycsICd9JywgJ2Vsc2UheyFzdGF0ZW1lbnRzIX0/J10sXG4gICAgd2hpbGVTdGF0ZW1lbnQ6IFsnd2hpbGUnLCAnKCcsICdleHByZXNzaW9uJywgJyknLCAneycsICdzdGF0ZW1lbnRzJywgJ30nXSxcbiAgICBkb1N0YXRlbWVudDogWydkbycsICdzdWJyb3V0aW5lQ2FsbCcsICc7J10sXG4gICAgcmV0dXJuU3RhdGVtZW50OiBbJ3JldHVybicsICdleHByZXNzaW9uPycsICc7J10sXG4gICAgY2xhc3NEZWM6IFsnY2xhc3MnLCAnY2xhc3NOYW1lJywgJ3snLCAnY2xhc3NWYXJEZWMqJywgJ3N1YlJvdXRpbmVEZWMqJywgJ30nXSxcbiAgICBjbGFzc1ZhckRlYzogWydzdGF0aWN8ZmllbGQnLCAndHlwZScsICd2YXJOYW1lJywgJywhdmFyTmFtZSonLCAnOyddLFxuICAgIHR5cGU6ICdpbnR8Y2hhcnxib29sZWFufGNsYXNzTmFtZScsXG4gICAgc3Vicm91dGluZURlYzogWydjb25zdHJ1Y3RvcnxmdW5jdGlvbnxtZXRob2QnLCAndm9pZHx0eXBlJywgJ3N1YnJvdXRpbmVOYW1lJywgJygnLCAncGFyYW1ldGVyTGlzdD8nLCAnKScsICdzdWJyb3V0aW5lQm9keSddLFxuICAgIHBhcmFtZXRlckxpc3Q6IFsndHlwZScsICd2YXJOYW1lJywgJywhdHlwZSF2YXJOYW1lKiddLFxuICAgIHN1YnJvdXRpbmVCb2R5OiBbJ3snLCAndmFyRGVjKicsICdzdGF0ZW1lbnRzJywgJ30nXSxcbiAgICB2YXJEZWM6IFsndmFyJywgJ3R5cGUnLCAndmFyTmFtZScsICcsIXZhck5hbWUqJywgJzsnXSxcbiAgICBjbGFzc05hbWU6ICdpZGVudGlmaWVyJyxcbiAgICBzdWJyb3V0aW5lTmFtZTogJ2lkZW50aWZpZXInLFxuICAgIHZhck5hbWU6ICdpZGVudGlmaWVyJyxcbiAgICBleHByZXNzaW9uOiBbJ3Rlcm0nLCAnb3AhdGVybSonXSxcbiAgICB0ZXJtOiAnaW50ZWdlckNvbnN0YW50fHN0cmluZ0NvbnN0YW50fGtleXdvcmRDb25zdGFudHx2YXJOYW1lfHZhck5hbWUhWyFleHByZXNzaW9uIV18c3Vicm91dGluZUNhbGx8KCFleHByZXNzaW9uISl8dW5hcnlPcCF0ZXJtJyxcbiAgICBzdWJyb3V0aW5lQ2FsbDogJ2Z1bmN0aW9uQ2FsbHxtZXRob2RDYWxsJyxcbiAgICBmdW5jdGlvbkNhbGw6IFsnc3Vicm91dGluZU5hbWUnLCAnKCcsICdleHByZXNzaW9uTGlzdD8nLCAnKSddLFxuICAgIG1ldGhvZENhbGw6IFsnY2xhc3NOYW1lfHZhck5hbWUnLCAnLicsICdzdWJyb3V0aW5lTmFtZScsICcoJywgJ2V4cHJlc3Npb25MaXN0PycsICcpJ10sXG4gICAgZXhwcmVzc2lvbkxpc3Q6IFsnZXhwcmVzc2lvbicsICcsIWV4cHJlc3Npb24qJ10sXG4gICAgb3A6ICcrfC18KnwvfCZ8fHw8fD58PScsXG4gICAgdW5hcnlPcDogJy18ficsXG4gICAga2V5d29yZENvbnN0YW50OiAndHJ1ZXxmYWxzZXxudWxsfHRoaXMnLFxuICB9LCAvLyBMb29rcyBjb3JyZWN0XG4gIGxleGljYWxFbGVtZW50czoge1xuICAgIGtleXdvcmQ6IFsnY2xhc3MnLCAnY29uc3RydWN0b3InLCAnZnVuY3Rpb24nLCAnbWV0aG9kJywgJ2ZpZWxkJywgJ3N0YXRpYycsICd2YXInLCAnaW50JywgJ2NoYXInLFxuICAgICAgJ2Jvb2xlYW4nLCAndm9pZCcsICd0cnVlJywgJ2ZhbHNlJywgJ251bGwnLCAndGhpcycsICdsZXQnLCAnZG8nLCAnaWYnLCAnZWxzZScsICd3aGlsZScsICdyZXR1cm4nXSxcbiAgICBzeW1ib2w6IC97fH18XFwofFxcKXxcXFt8XFxdfFxcLnwsfDt8XFwrfC18XFwqfFxcL3wmfFxcfHw8fD58PXx+LyxcbiAgICBpbnRlZ2VyQ29uc3RhbnQ6IG4gPT4gTnVtYmVyKG4pID49IDAgJiYgTnVtYmVyKG4pIDw9IDMyNzY3LFxuICAgIGlkZW50aWZpZXI6IC9eXFxEXFx3Ki8sXG4gICAgc3RyaW5nQ29uc3RhbnQ6IHMgPT4gIXMuaW5jbHVkZXMoJ1wiJykgJiYgIXMuaW5jbHVkZXMoJ1xcbicpLFxuICB9LFxufTtcblxuYW5hbHl6ZShwcm9jZXNzLmFyZ3ZbMl0sIGdyYW1tYXIpO1xuIl19