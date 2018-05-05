const getAttrList = require("./utils/getAttrList");
const parseUrl = require("./utils/parseUrl");
const findAllTags = require("./utils/findAllTags");

function find(html, options = { tag: "", attr: "", "parseAttrValueAsUrl": false }) {
  const results = [];
  const { tag, attr, parseAttrValueAsUrl = false } = options;
  if (!tag) {
    throw "tag is required"
  }
  if (!attr) {
    throw "attr is required"
  }
  let tags = findAllTags(html,options);

  // tags = [ 'src="./hello.jpg"', 'width=100 src="./hello.jpg"' ]
  tags.forEach(match => {
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