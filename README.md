# html-find-src

[WIP] Find (or replace, sync/async) img src (or other attributes of other elements) in an html string

# API

## [find(html, options?)](./tests/find.js)

## replace(html, callback, options?)

```javascript
...
```

## replaceAsync(html, callback, options?)

```javascript
...
```

## available options

```json
{"tag":"img", "attr":""}
```

# DEMOS

## download and replace all image links in html
```javascript
let replacedHtml = await replaceAsync(html, (link, parsedLink)=>{
    return http.get(parsedLink).then(saveToTmpFile).then(result => result.localImagePath)
})
```
