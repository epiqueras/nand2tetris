/* eslint-disable no-useless-escape */
import fs from 'fs';

import testRule from './utils';

const currentChar = Buffer.from([0x20]);

function nextChar(input) {
  return fs.readSync(input, currentChar, 0, 1);
}

function nextToken(input, lexicalElements) {
  let token = '';

  while (/\s/.test(currentChar.toString()) && nextChar(input)) token = currentChar.toString();

  if (testRule(currentChar.toString(), lexicalElements.symbol)) {
    token = currentChar.toString();
    currentChar.write(' ');
    return token;
  }

  let bytesRead = nextChar(input);
  while (bytesRead && !/\s/.test(currentChar.toString()) && !testRule(currentChar.toString(), lexicalElements.symbol)) {
    token += currentChar.toString();
    bytesRead = nextChar(input);
  }

  return token.trim();
}

function categorize(token, lexicalElements) {
  const matched = Object.keys(lexicalElements)
    .find(element => testRule(token, lexicalElements[element]));
  if (matched) return matched;
  throw new Error('Invalid token.');
}

export default function advance(input, lexicalElements) {
  const token = nextToken(input, lexicalElements);
  return token ? { content: token, tag: categorize(token, lexicalElements) } : token;
}
