const getAttrList = require("./utils/getAttrList");
const parseUrl = require("./utils/parseUrl");

function find(html, options = { tag: "", attr: "", "parseAttrValueAsUrl": false }) {
  const results = [];
  const { tag, attr, parseAttrValueAsUrl = false } = options;
  if (!tag) {
    throw "tag is required"
  }
  if (!attr) {
    throw "tag is required"
  }
  let tagRegexp = new RegExp(`<${tag} (.+?)/?>`, "img");
  let tagRegexpMatch = tagRegexp.exec(html);
  let tagRegexpMatches = [];
  while (tagRegexpMatch != null) {
    tagRegexpMatches.push({
      index: tagRegexpMatch.index + 2 + tag.length,
      value: tagRegexpMatch[1],
    });
    tagRegexpMatch = tagRegexp.exec(html);
  }
  // tagRegexpMatches = [ 'src="./hello.jpg"', 'width=100 src="./hello.jpg"' ]
  tagRegexpMatches.forEach(match => {
    let attrList = getAttrList(match.value);
    let attrValue = attrList[attr];
    if (attrValue) {
      let item = { ...attrValue, index: attrValue.index + match.index };
      if (parseAttrValueAsUrl) {
        item.parsedUrl = parseUrl(attrValue.value, options);
      }
      results.push(item);
    }
  });

  return results;
}

module.exports = find;