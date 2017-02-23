export default function testRule(token, test) {
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
