function getAttrList(raw) {
  let list = {};
  let attrName = "";
  let attrValue = "";
  let valueIndex = 0;
  let state = 0; // 0 = looking for attr, 1 = looking for value
  let quote = "";
  for (let i = 0; i < raw.length; i++) {
    let next = raw[i];
    if (next === '=') {
      if (state === 0) {
        state = 1;
        //next: find what quote it uses
        i++;
        while(raw[i] === ` ` || raw[i] === "\t" || raw[i] === "\n" || raw[i] === "\r" || raw[i] === "\f"){
          i++;
        }
        if (raw[i] === `'`) {
          quote = `'`;
        } else if (raw[i] === `"`) {
          quote = `"`;
        } else {
          quote = ` `; // space for no-quotes
          i--;
        }
        valueIndex = i + 1;
      } else if (state === 1) {
        if (!quote || quote === ' ') {
          throw "unexpected =";
        }
        attrValue += next;
      }
    } else if (quote && next === quote) {
      state = 0;
      list [attrName] = { value: attrValue, index: valueIndex };
      attrName = "";
      attrValue = "";
      quote = "";
      // works too for "space for no-quotes"
    } else if (next === ` ` || next === "\t" || next === "\n" || next === "\r" || next === "\f") {
      if (state === 1) {
        attrValue += next;
      }
    } else {
      // default case for all remaining characters
      if (state === 0) {
        if (next === ` ` || next === "\t" || next === "\n" || next === "\r" || next === "\f") {
        } else {
          attrName += next;
        }
      } else if (state === 1) {
        attrValue += next;
      }
    }
  }
  if (attrName && attrValue) {
    list[attrName] = { value: attrValue, index: valueIndex };
  }
  return list;
}

module.exports = getAttrList;