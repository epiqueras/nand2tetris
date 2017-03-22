import { writeWithTags, openTag, closeTag, testRule } from './utils';

let openTags = [];
let isComment = false;
let prevToken = { tag: '', content: '' };
const ruleIndexes = [];

let indexSnapshot = [];

export function parseStructure(structure) {
  if (!structure) return null;

  Object.keys(structure).forEach((key) => {
    switch (typeof structure[key]) {
      case 'object':
        structure[key] = { // eslint-disable-line no-param-reassign
          parts: structure[key].map((str) => {
            const lastChar = str[str.length - 1];
            return {
              parts: str.split('!').map(part => /\*|\?/.test(part[part.length - 1]) ? part.slice(0, part.length - 1) : part),
              optional: lastChar === '?',
              multiple: lastChar === '*',
            };
          }),
          optional: false,
          multiple: false,
        };
        break;
      case 'string':
        structure[key] = { // eslint-disable-line no-param-reassign
          parts: structure[key].split('!').map(part => /\*|\?/.test(part[part.length - 1]) ? part.slice(0, part.length - 1) : part),
          optional: structure[key][structure[key].length - 1] === '?',
          multiple: structure[key][structure[key].length - 1] === '*',
        };
        break;
      default:
        throw new Error('Invalid rule.');
    }
  });

  return structure;
}

function fetchMatch(token, { structure, lexicalElements }) {
  // Get the last index
  const currentTagIndexes = ruleIndexes[ruleIndexes.length - 1];

  // Get the current tag
  const currentTagName = openTags[ruleIndexes.length].tag;

  let str = currentTagName;
  let optional = false;
  let multiple = false;

  currentTagIndexes.forEach((index) => {
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
    return fetchMatch(token, { structure, lexicalElements });
  } else if (typeof str !== 'string' || structure[str]) {
    currentTagIndexes.push(0);
    return fetchMatch(token, { structure, lexicalElements });
  }

  if (!multiple) {
    currentTagIndexes[currentTagIndexes.length - 1] += 1;
  }

  // Lexical element match
  if (str === token.content || (lexicalElements[str] && testRule(token, lexicalElements[str]))) {
    openTags[ruleIndexes.length].content.push(token);
    return token;
  } else if (multiple) { // No match and multiple
    currentTagIndexes[currentTagIndexes.length - 1] += 1;
    return fetchMatch(token, { structure, lexicalElements });
  } else if (optional) {
    return fetchMatch(token, { structure, lexicalElements });
  }

  return null;
}

// Compiles a rule
function compileStatement(output, token, grammar) {
  const { structure } = grammar;

  if (!ruleIndexes.length) { // No current rule
    const newRule = structure.statement.parts[0].split('|').find(type => structure[type].parts[0].parts[0].split('|').find(str => str === token.content));

    if (newRule) {
      openTags.push({ tag: newRule, content: [token] });
      ruleIndexes.push([1]);
    }
    return null;
  }

  const matched = fetchMatch(token, grammar);
}

// Drives compiler logic. Skips comments and checks if in structure or token mode
// TODO: Optimize by removing unnecesary checks
export default function compiler(output, token, grammar) {
  if (!token) { // End of file
    openTags = [];
    return closeTag(output, 'tokens');
  } else if (!openTags.length) { // First token
    openTags.push({ tag: 'tokens' });
    openTag(output, 'tokens');
  }

  // Possible comment
  if (!isComment && token.content === '/') isComment = true;

  // Check if it's really a comment
  if (isComment === true && prevToken.content === '/') {
    if (token.content === '*') isComment = 'multiline';
    else if (token.content === '/') isComment = 'inline';
    else { // Was not a comment
      isComment = false;
      writeWithTags(output, '/', 'symbol', openTags.length);
    }
  }

  // Write if it's not a newline character or part of a comment
  if (!isComment && token.tag !== 'eol') {
    if (!grammar.structure) writeWithTags(output, token.content, token.tag, openTags.length);
    else {
      compileStatement(output, token, grammar);
    }
  }

  if (isComment === 'multiline' && prevToken.content === '*' && token.content === '/') isComment = false; // End of multiline comment?
  if (isComment === 'inline' && token.tag === 'eol') isComment = false; // End of inline comment?

  prevToken = token;
  return null;
}
