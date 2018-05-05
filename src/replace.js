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
    segments.push(normalizedCallback(result));
  });
  if (pointer < html.length) {
    segments.push(html.substring(pointer, html.length - 1))
  }
  return segments.join('');
}

module.exports = replace;