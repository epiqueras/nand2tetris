import { writeWithTags, openTag, closeTag } from './utils';

const openTags = [];

export default function compiler(output, token, structure) {
  if (!token) {
    return closeTag(output, 'tokens');
  } else if (!openTags.length) {
    openTags.push({ tag: 'tokens' });
    openTag(output, 'tokens');
  }

  if (!structure) writeWithTags(output, token.content, token.tag, openTags.length);
  return null;
}
