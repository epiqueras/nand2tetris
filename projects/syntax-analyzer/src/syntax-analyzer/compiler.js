import { writeWithTags, openTag, closeTag } from './utils';

let openTags = [];
let isComment = false;
let prevToken = { content: '', tag: '' };

export default function compiler(output, token, structure) {
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
    if (!structure) writeWithTags(output, token.content, token.tag, openTags.length);
  }

  if (isComment === 'multiline' && prevToken.content === '*' && token.content === '/') isComment = false; // End of multiline comment?
  if (isComment === 'inline' && token.tag === 'eol') isComment = false; // End of inline comment?

  prevToken = token;
  return null;
}
