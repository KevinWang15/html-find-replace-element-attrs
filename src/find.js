const getAttrList = require("./utils/getAttrList");
const parseUrl = require("./utils/parseUrl");

function find(html, settings = { tag: "img", attr: "src", "parseAttrValueAsUrl": false }) {
  const results = [];
  const { tag = "img", attr = "src", parseAttrValueAsUrl = false } = settings;
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
        item.parsedUrl = parseUrl(attrValue.value, settings);
      }
      results.push(item);
    }
  });

  return results;
}

module.exports = find;