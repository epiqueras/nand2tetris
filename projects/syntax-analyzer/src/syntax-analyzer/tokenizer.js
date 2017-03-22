/* eslint-disable no-useless-escape */
import fs from 'fs';
import os from 'os';

import { testRule, isQuote } from './utils';

const currentChar = Buffer.from([0x20]);
let isLiteral = false;

function nextChar(input) {
  return fs.readSync(input, currentChar, 0, 1);
}

function nextToken(input, lexicalElements) {
  let token = '';

  // Skip over whitespace
  while (currentChar.toString() !== os.EOL && /\s/.test(currentChar.toString()) && nextChar(input)) token = currentChar.toString();

  // Stop and return symbols
  if (testRule(currentChar.toString(), lexicalElements.symbol)
    || currentChar.toString() === os.EOL) {
    token = currentChar.toString();
    currentChar.write(' ');
    return token;
  }

  // Different rules for string literals
  if (isQuote(currentChar.toString())) {
    isLiteral = currentChar.toString();
    token = '';
    let bytesRead = nextChar(input);
    while (bytesRead && currentChar.toString() !== isLiteral) {
      token += currentChar.toString();
      bytesRead = nextChar(input);
    }
    currentChar.write(' ');
    return token;
  }

  // Concatenate other characters
  let bytesRead = nextChar(input);
  while (bytesRead && !/\s/.test(currentChar.toString()) && !testRule(currentChar.toString(), lexicalElements.symbol)) {
    token += currentChar.toString();
    bytesRead = nextChar(input);
  }

  return token.trim();
}

// Assigns token to a lexical element
function categorize(token, lexicalElements) {
  if (isLiteral) {
    isLiteral = false;
    if (lexicalElements.stringConstant) {
      if (testRule(token, lexicalElements.stringConstant)) return 'stringConstant';
      throw new Error('Invalid string constant.');
    } else return 'stringConstant';
  }

  if (token === os.EOL) return 'eol';
  const matched = Object.keys(lexicalElements)
    .find(element => testRule(token, lexicalElements[element]));
  if (matched) return matched;
  throw new Error('Invalid token.');
}

// Advances compilation to the next token
export default function advance(input, lexicalElements) {
  const token = nextToken(input, lexicalElements);
  return token ? { content: token, tag: categorize(token, lexicalElements) } : token;
}
