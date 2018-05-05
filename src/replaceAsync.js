const find = require("./find");
const replace = require("./replace");

function replaceAsync(html, callback, options) {
  if (typeof callback === 'string') {
    return Promise.resolve(replace(html, callback, options));
  }
  let findResult = find(html, options);
  let callbackPromises = [];
  findResult.forEach(result => {
    let callbackResult = callback(result);
    if (typeof callbackResult === 'string') {
      callbackPromises.push(Promise.resolve(callbackResult));
    } else {
      callbackPromises.push(callbackResult);
    }
  });

  return new Promise(resolve => {
    Promise.all(callbackPromises).then(replacements => {
      let i = 0;
      resolve(replace(html, (cb) => replacements[i++], options))
    });
  });
}

module.exports = replaceAsync;