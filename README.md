# html-find-replace-element-attrs [![Build Status](https://travis-ci.org/KevinWang15/html-find-replace-element-attrs.svg?branch=master)](https://travis-ci.org/KevinWang15/html-find-replace-element-attrs) [![codecov](https://codecov.io/gh/KevinWang15/html-find-replace-element-attrs/branch/master/graph/badge.svg)](https://codecov.io/gh/KevinWang15/html-find-replace-element-attrs)

[WIP] Find (or replace, sync/async) attributes of elements (e.g. img src) in an html string.

For Node & for the browser.

# API

## [find(html, options?)](./tests/find.js)

## [replace(html, callback, options?)](./tests/replace.js)

## [replaceAsync(html, callback, options?)](./tests/replaceAsync.js)

## available options

```json
{"tag":"img", "attr":"src", "parseAttrValueAsUrl":false, "baseUrl":"", "urlProtocol": "(automatically set from baseUrl or )http"}
```

# DEMOS

## download and replace all image links in html
```javascript
let replacedHtml = await replaceAsync(html, (item)=>{
    return http.get(item.parsedUrl).then(saveToLocal).then(result => result.localImagePath)
}, { tag:"img", attr:"src", parseAttrValueAsUrl: true })
```

# LICENSE
MIT