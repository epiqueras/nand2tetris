import fs from 'fs';

export function testRule(token, test) {
  if (test instanceof RegExp) return test.test(token);
  switch (typeof test) {
    case 'object':
      return test.find(t => t === token);
    case 'function':
      return test(token);
    case 'string':
      return test === token;
    default:
      throw new Error('Invalid grammar rule.');
  }
}

export function isQuote(char) {
  return char === '"' || char === "'";
}

function getWhitespace(indentation) {
  return indentation ? '  '.repeat(indentation) : '';
}

export function openTag(output, tag, indentation) {
  fs.writeSync(output, `${getWhitespace(indentation)}<${tag}>\n`);
}

export function closeTag(output, tag, indentation) {
  fs.writeSync(output, `${getWhitespace(indentation)}</${tag}>\n`);
}

export function writeWithTags(output, content, tag, indentation) {
  let strToWrite = content;
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
  fs.writeSync(output, `${getWhitespace(indentation)}<${tag}>${strToWrite}</${tag}>\n`);
}
