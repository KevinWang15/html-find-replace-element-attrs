function findAllTags(html, options) {
  const { tag } = options;
  let list = [];
  let state = 0; //0 = not in target tag. 1 = building target tag
  let buffer = "";
  let quotes = "";

  for (let i = 0; i < html.length; i++) {
    let next = html[i];
    if (next === "<") {
      if (state === 0) {
        let remainingHtml = html.substr(i + 1);
        if (remainingHtml.startsWith(tag + " ") || remainingHtml.startsWith(tag + "\t") || remainingHtml.startsWith(tag + "\n") || remainingHtml.startsWith(tag + "\n") || remainingHtml.startsWith(tag + "\f")) {
          state = 1;
          i += tag.length + 1;
          buffer = "";
        }
      } else if (state === 1) {
        buffer += next;
      }
    } else if (next === "/") {
      if (state === 0) {
      } else if (state === 1) {
        let remainingHtml = html.substr(i + 1);
        if (remainingHtml.startsWith(">") && !quotes) {
          list.push({ value: buffer, index: i - buffer.length });
          i++;
          state = 0;
        } else {
          buffer += next;
        }
      }
    } else if (next === ">") {
      if (state === 0) {
      } else if (state === 1) {
        if (!quotes) {
          list.push({ value: buffer, index: i - buffer.length });
          state = 0;
        } else {
          buffer += next;
        }
      }
    } else if (next === `'` || next === `"`) {
      if (state === 0) {
      } else if (state === 1) {
        if (!quotes) {
          quotes = next;
        } else if (quotes === next) {
          quotes = "";
        }
        buffer += next;
      }
    } else {
      if (state === 0) {
      } else if (state === 1) {
        buffer += next;
      }
    }
  }

  console.log("List", list);
  return list;

  // let tags=[];
  // let tagRegexp = new RegExp(`<${tag} (.+?)/?>`, "img");
  // let tagRegexpMatch = tagRegexp.exec(html);
  // while (tagRegexpMatch != null) {
  //   tags.push({
  //     index: tagRegexpMatch.index + 2 + tag.length,
  //     value: tagRegexpMatch[1],
  //   });
  //   tagRegexpMatch = tagRegexp.exec(html);
  // }
  // return tags;
}

module.exports = findAllTags;