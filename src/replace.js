const find = require("./find");

function normalizeCallback(callback) {
  if (typeof callback === 'string') {
    return () => callback;
  } else {
    return callback;
  }
}

function replace(html, callback, options) {
  let normalizedCallback = normalizeCallback(callback);
  let findResult = find(html, options);
  let segments = [];
  let pointer = 0;
  findResult.forEach(result => {
    if (result.index > pointer) {
      segments.push(html.substring(pointer, result.index));
      pointer = result.index;
    }
    pointer += result.value.length;
    let normalizedResult = normalizedCallback(result);
    if (result.quoteType === ' ' && (normalizedResult.indexOf(' ') >= 0 || normalizedResult.indexOf('\t') >= 0 || normalizedResult.indexOf('\n') >= 0 || normalizedResult.indexOf('\r') >= 0 || normalizedResult.indexOf('\f') >= 0)) {
      segments.push(`"${normalizedResult}"`);
    } else {
      segments.push(normalizedResult);
    }
  });
  if (pointer < html.length) {
    segments.push(html.substring(pointer, html.length))
  }
  return segments.join('');
}

module.exports = replace;