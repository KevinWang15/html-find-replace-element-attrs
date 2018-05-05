const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("find", function () {
  it("should find all occurrences of src in an html string", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        '...<img src="./hello.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...',
      ),
      [
        {
          value: "./hello.jpg",
          index: 13,
        },
        {
          "index": 58,
          "value": "./hello.jpg",
        },
      ]);
  });
  it("should be able to handle = in quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./1=2.jpg"/>'), [{
      value: './1=2.jpg',
      index: 13,
    }]);
  });
  it("should be able to handle cases without quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=abc.jpg width=100/>'), [{
      value: 'abc.jpg',
      index: 12,
    }]);
  });
  it("should be able to handle cases without quotes (case 2)", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=//example.com/abc.jpg/>'), [
      {
        "index": 12,
        "value": "//example.com/abc.jpg",
      },
    ]);
  });
  it("should be able find other attributes of other tags", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src=//example.com/abc.jpg/></div>', {
      attr: "class",
      tag: "div",
    }), [
      {
        value: 'my-class',
        index: 15,
      },
    ]);
  });
  it("should be able to work with parseUrl", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src=//example.com/abc.jpg/></div>', {
      parseAttrValueAsUrl: true,
    }), [
      {
        "index": 34,
        "parsedUrl": "http://example.com/abc.jpg",
        "value": "//example.com/abc.jpg",
      },
    ]);
  });
});
