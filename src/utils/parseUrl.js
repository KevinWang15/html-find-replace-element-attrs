const urlJoin = require("url-join");
const handleHtmlEntities = require('./handleHtmlEntities');

function processDotDot(url) {
  let match = url.match(/^((?:\w+:)?\/\/)?(.+?)$/im);
  let stack = match[2].split('/');
  let newStack = [];
  for (let i = 0; i < stack.length; i++) {
    if (stack[i] === '.') {
      continue;
    } else if (stack[i] === '..') {
      if (newStack.length > 1) {
        newStack.pop();
      }
    } else {
      newStack.push(stack[i]);
    }
  }
  return match[1]+newStack.join('/');
}

function parseUrl(urlToParse, options = {}) {
  let { urlProtocol, baseUrl } = options;

  // handle html entities
  urlToParse = handleHtmlEntities(urlToParse);

  if (urlToParse.startsWith("//")) {
    // it should parse protocol-relative URL
    if (!urlProtocol && baseUrl) {
      let protocalMatch = baseUrl.match(/^(\w+:)?\/\//im);
      if (protocalMatch != null) {
        urlProtocol = protocalMatch[1];
      }
    }
    if (!urlProtocol) {
      // default to http://
      urlProtocol = "http:"
    }
    if (!urlProtocol.endsWith(":")) {
      urlProtocol += ":";
    }
    return urlProtocol + urlToParse;
  }

  if (urlToParse.match(/^\w+:?\/\//im)) {
    // full url
    return urlToParse;
  } else {
    // relative url
    if (!baseUrl) {
      throw "baseUrl must be set to parse a relative url";
    }
    if (urlToParse.startsWith('/')) {
      let match = baseUrl.match(/^((?:\w+:)?\/\/)?(.+?)$/im);
      let stack = match[2].split('/');
      baseUrl = match[1] + stack[0];
    }
    let url = urlJoin(baseUrl, urlToParse);
    return processDotDot(url);
  }
}

module.exports = parseUrl;