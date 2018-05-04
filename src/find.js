const getAttrList = require("./utils/getAttrList");

function find(html, settings = { tag: "img", attr: "src" }) {
  const results = [];
  const { tag = "img", attr = "src" } = settings;
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
      results.push({ ...attrValue, index: attrValue.index + match.index });
    }
  });

  return results;
}

module.exports = find;