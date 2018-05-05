# html-find-replace-element-attrs [![Build Status](https://travis-ci.org/KevinWang15/html-find-replace-element-attrs.svg?branch=master)](https://travis-ci.org/KevinWang15/html-find-replace-element-attrs) [![codecov](https://codecov.io/gh/KevinWang15/html-find-replace-element-attrs/branch/master/graph/badge.svg)](https://codecov.io/gh/KevinWang15/html-find-replace-element-attrs)

Find (or replace, sync/async) attributes of elements (e.g. img src) in an html string, for browser & Node.js.

It's a new library, its stability has not been battle-tested. If you find a bug, [please report](https://github.com/KevinWang15/html-find-replace-element-attrs/issues/new).

# API

## [find(html, options?)](./tests/find.js)

Find all values of an attribute of a type of element.

```javascript
htmlFindReplaceElementAttrs.find(
  `<div><img src='a.jpg' alt=''><img src="b.jpg" alt=''><img src=c.jpg alt=''></div>`,
  { tag: "img", attr: "src" }
)
```

produces:

```json
[
    {
        "value": "a.jpg",
        "index": 15,
        "quoteType": "'"
    },
    {
        "value": "b.jpg",
        "index": 39,
        "quoteType": "\""
    },
    {
        "value": "c.jpg",
        "index": 62,
        "quoteType": " "
    }
]

```

If the attribute value is a url, it can also help you parse relative urls (you need to set ```parseAttrValueAsUrl``` to ```true``` and specify ```baseUrl``` in ```options```)

```javascript
htmlFindReplaceElementAttrs.find(
  "<div><img src='../a.jpg' alt=''><img src='/b.jpg' alt=''><img src='c.jpg' alt=''></div>",
  { tag: "img", attr: "src", parseAttrValueAsUrl: true, baseUrl: "http://www.example.com/hello/world/" },
)
```

produces:

```json
[
    {
        "value": "../a.jpg",
        "index": 15,
        "quoteType": "'",
        "parsedUrl": "http://www.example.com/hello/a.jpg"
    },
    {
        "value": "/b.jpg",
        "index": 42,
        "quoteType": "'",
        "parsedUrl": "http://www.example.com/b.jpg"
    },
    {
        "value": "c.jpg",
        "index": 67,
        "quoteType": "'",
        "parsedUrl": "http://www.example.com/hello/world/c.jpg"
    }
]
```

To parse protocol independent urls, set ```urlProtocol``` in ```options```

```javascript
htmlFindReplaceElementAttrs.find(
  "<div><img src='//example.com/a.jpg' alt=''><img src='//example.com/b.jpg' alt=''></div>",
  { tag: "img", attr: "src", parseAttrValueAsUrl: true, urlProtocol: "https" },
)
```

produces:

```json
[
    {
        "value": "//example.com/a.jpg",
        "index": 15,
        "quoteType": "'",
        "parsedUrl": "https://example.com/a.jpg"
    },
    {
        "value": "//example.com/b.jpg",
        "index": 53,
        "quoteType": "'",
        "parsedUrl": "https://example.com/b.jpg"
    }
]
```

### options
#### tag
What element are you looking for (e.g. "img")

#### attr
What attribute are you looking for (e.g. "src")

#### parseAttrValueAsUrl
If set to true, the return value will also contain ```parsedUrl```.

Make sure to set ```baseUrl``` if the html contains relative url, or with ```parseAttrValueAsUrl``` turned on it will throw an exception.

#### baseUrl
Used in conjunction with ```parseAttrValueAsUrl``` (e.g. "http://example.com/test/")

#### urlProtocol
Used when parsing protocol independent urls (defaults to the one in ```baseUrl``` or "http").

### return value
Return value is an array of ```{value, index, quoteType, parsedUrl?}```

#### value
The value as is in the html string.

#### index
Position of the value in the html string.

#### quoteType
What kind of quote surrounds the value.

Can be ```"```, ```'```, or ``` ```

**Caution: a ```space``` is used to indicate "no quotes", e.g. in ```<img width=100>```**

#### parsedUrl
It will be present only when you set ```parseAttrValueAsUrl``` to true.

It indicates what the final url should be in the context you provide.

Useful when you need to interact with the links in attribute values. (e.g. when you need to download and localize all images from ```img src```)


## [replace(html, callback, options?)](./tests/replace.js)

Replace values of an attribute of a type of element.

```javascript
htmlFindReplaceElementAttrs.replace(
  "<div><img src='../a.jpg' alt=''><img src='/b.jpg' alt=''><img src='c.jpg' alt=''></div>",
  "http://www.abc.com/1.jpg",
  { tag: "img", attr: "src" },
)
```

produces:

```
<div><img src='http://www.abc.com/1.jpg' alt=''><img src='http://www.abc.com/1.jpg' alt=''><img src='http://www.abc.com/1.jpg' alt=''></div>
```

It works with callback functions.

```javascript
htmlFindReplaceElementAttrs.replace(
  "<div><img src='../a.jpg' alt=''><img src='/b.jpg' alt=''><img src='c.jpg' alt=''></div>",
  item => item.value.toUpperCase(),
  { tag: "img", attr: "src" },
)
```

produces:

```
<div><img src='../A.JPG' alt=''><img src='/B.JPG' alt=''><img src='C.JPG' alt=''></div>"
```

The parameter passed into the callback function is the same as that in the ```return value``` of ```find``` (i.e. ```{value, index, quoteType, parsedUrl?}```)

The ```options``` is the same as that of ```find```, too. 

e.g. You may use ```parseAttrValueAsUrl```.
```javascript
htmlFindReplaceElementAttrs.replace(
  "<div><img src='../a.jpg' alt=''><img src='//example2.com/b.jpg' alt=''></div>",
  item => item.parsedUrl,
  {
    tag: "img",
    attr: "src",
    parseAttrValueAsUrl: true,
    baseUrl: "https://www.example.com/hello/world",
    urlProtocol: "http",
  },
)
```

produces:

```
<div><img src='https://www.example.com/hello/a.jpg' alt=''><img src='http://example2.com/b.jpg' alt=''></div>
```

It is also smart enough to automatically add quotes for you sometimes.

```javascript
htmlFindReplaceElementAttrs.replace(
  "<div><img src=a.jpg></div>",
  "hello world.jpg",
  {
    tag: "img",
    attr: "src"
  },
)
```

produces:

```
<div><img src="hello world.jpg"></div>
```

### options

Same as that of ```find```

### return value

```string```

## [replaceAsync(html, callback, options?)](./tests/replaceAsync.js)

The async version of ```replace```.

It will return a ```Promise```, callbacks can return ```Promise```s too.

It is very useful when you want to perform async operations during the replacement.

```javascript
htmlFindReplaceElementAttrs.replaceAsync('<img src="./abc.jpg"/>',
  _ => new Promise(resolve => {
    setTimeout(() => resolve(_.value.toUpperCase()), 1000)
  }),
  {
    tag: "img",
    attr: "src",
  }
)
```

produces a ```Promise``` that will resolve in 1000ms, with the value:
```
<img src="./ABC.JPG"/>
```

### options

Same as that of ```replace```

### return value

```Promise<string>```

# DEMOS

## download and replace all image links in html
```javascript
let replacedHtml = await replaceAsync(html, (item)=>{
    return http.get(item.parsedUrl).then(saveToLocal).then(result => result.localImagePath)
}, { tag:"img", attr:"src", parseAttrValueAsUrl: true })
```

# LICENSE
MIT