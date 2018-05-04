const find = require("./find");

function replaceAsync(html, callback, settings = { tag: "img", attr: "src" }) {
  let findResult = find(html, settings);
  let segments = [];
  let pointer = 0;
  findResult.forEach(result => {
    if (result.index > pointer) {
      segments.push(Promise.resolve(html.substring(pointer, result.index)));
      pointer = result.index;
    }
    pointer += result.value.length;
    segments.push(callback(result.value));
  });
  if (pointer < html.length) {
    segments.push(Promise.resolve(html.substring(pointer, html.length - 1)))
  }
  return Promise.all(segments).then(_ => _.join(''));
}

module.exports = replaceAsync;