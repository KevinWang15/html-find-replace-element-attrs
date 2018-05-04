function getAttrList(raw) {
  let list = {};
  let attrName = "";
  let attrValue = "";
  let state = 0; // 0 = looking for attr, 1 = looking for value
  let quote = "";
  for (let i = 0; i < raw.length; i++) {
    let next = raw[i];
    if (next === '=') {
      if (state === 0) {
        state = 1;
        //next: find what quote it uses
        i++;
        if (raw[i] === `'`) {
          quote = `'`;
        } else if (raw[i] === `"`) {
          quote = `"`;
        } else {
          quote = ` `; // space for no-quotes
          i--;
        }
      } else if (state === 1) {
        if (!quote) {
          throw "unexpected =";
        }
        attrValue += next;
      }
    } else if (quote && next === quote) {
      state = 0;
      list [attrName] = attrValue;
      // works too for "space for no-quotes"
    } else if (next === ` `) {
      if (state === 1) {
        attrValue += next;
      }
    } else {
      // default case for all remaining characters
      if (state === 0) {
        attrName += next;
      } else if (state === 1) {
        attrValue += next;
      }
    }
  }
  return list;
}

function find(html, settings = { tag: "img", attr: "src" }) {
  const results = [];
  const { tag = "img", attr = "src" } = settings;
  let tagRegexp = new RegExp(`<${tag} (.+?)>`, "img");
  let tagRegexpMatch = tagRegexp.exec(html);
  let tagRegexpMatches = [];
  while (tagRegexpMatch != null) {
    tagRegexpMatches.push(tagRegexpMatch[1]);
    tagRegexpMatch = tagRegexp.exec(html);
  }
  // tagRegexpMatches = [ 'src="./hello.jpg"', 'width=100 src="./hello.jpg"' ]
  tagRegexpMatches.forEach(match => {
    let attrList = getAttrList(match);
    if (attrList[attr]) {
      results.push(attrList[attr]);
    }
  });

  return results;
}

module.exports = { find };