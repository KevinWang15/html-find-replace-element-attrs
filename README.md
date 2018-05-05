# html-find-src
[![Build Status](https://travis-ci.org/KevinWang15/html-find-src.svg?branch=master)](https://travis-ci.org/KevinWang15/html-find-src)
[![codecov](https://codecov.io/gh/KevinWang15/html-find-src/branch/master/graph/badge.svg)](https://codecov.io/gh/KevinWang15/html-find-src)

[WIP] Find (or replace, sync/async) img src (or other attributes of other elements) in an html string

# API

## [find(html, options?)](./tests/find.js)

## [replace(html, callback, options?)](./tests/replace.js)

## [replaceAsync(html, callback, options?)](./tests/replaceAsync.js)

## available options

```json
{"tag":"img", "attr":"", "parseAttrValueAsUrl":false, "baseUrl":"", "urlProtocol": "(automatically set from baseUrl or )http"}
```

# DEMOS

## download and replace all image links in html
```javascript
let replacedHtml = await replaceAsync(html, (link, parsedLink)=>{
    return http.get(parsedLink).then(saveToTmpFile).then(result => result.localImagePath)
}, { parseAttrValueAsUrl:true })
```
