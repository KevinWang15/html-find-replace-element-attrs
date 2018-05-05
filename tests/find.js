const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;

describe("find", function () {
  it("should find all occurrences of src in an html string", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        '...<img src="./hello.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...',
        { tag: "img", attr: "src" },
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
  it("should work with single quotes", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        "...<img src='./hello.jpg'>abc</img>...",
        { tag: "img", attr: "src" },
      ),
      [
        {
          value: "./hello.jpg",
          index: 13,
        },
      ]);
  });
  it("should work with space in attr", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        "...<img src='./hello world.jpg'>abc</img>...",
        { tag: "img", attr: "src" },
      ),
      [
        {
          value: "./hello world.jpg",
          index: 13,
        },
      ]);
  });
  it("should work with alternating quotes", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        `...<img src='./hello "world".jpg'>abc</img>...`,
        { tag: "img", attr: "src" },
      ),
      [
        {
          value: `./hello "world".jpg`,
          index: 13,
        },
      ]);
  });
  it("should work even if surrounded by other attrs", function () {
    assert.deepEqual(
      htmlFindSrc.find(
        `...<img class="a" src='./helloworld.jpg' id="b">abc</img>...`,
        { tag: "img", attr: "src" },
      ),
      [
        {
          "value": "./helloworld.jpg",
          "index": 23,
        },
      ]);
  });
  it("should throw when encountering unexpected =", function () {
    expect(
      () => htmlFindSrc.find(
        "...<img src=helloworld=aaa>abc</img>...",
        { tag: "img", attr: "src" },
      )).to.throw();
  });
  it("should be able to handle = in quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./1=2.jpg"/>', { tag: "img", attr: "src" }), [{
      value: './1=2.jpg',
      index: 13,
    }]);
  });
  it("should be able to handle cases without quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=abc.jpg width=100/>', {
      tag: "img",
      attr: "src",
    }), [{
      value: 'abc.jpg',
      index: 12,
    }]);
  });
  it("should be able to handle cases without quotes (case 2)", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=//example.com/abc.jpg/>', {
      tag: "img",
      attr: "src",
    }), [
      {
        "index": 12,
        "value": "//example.com/abc.jpg",
      },
    ]);
  });
  it("should be able to work with parseUrl", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src=//example.com/abc.jpg/></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 34,
        "parsedUrl": "http://example.com/abc.jpg",
        "value": "//example.com/abc.jpg",
      },
    ]);
  });
  it("should work with html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/%E5%95%8A%20啊a&#183;.png" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/%E5%95%8A%20啊a·.png",
        "value": "http://www.example.com/%E5%95%8A%20啊a&#183;.png",
      },
    ]);
  });
  it("should work with special html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&quot;.png" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/\".png",
        "value": "http://www.example.com/&quot;.png",
      },
    ]);
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&quot.png" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/\".png",
        "value": "http://www.example.com/&quot.png",
      },
    ]);
  });
  it("should not treat &gt=1 as html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&gt=1" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/&gt=1",
        "value": "http://www.example.com/&gt=1"
      },
    ]);
  });
  it("should not treat &gt1 as html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&gt1" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/&gt1",
        "value": "http://www.example.com/&gt1"
      },
    ]);
  });
  it("should treat &gt as html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&gt " alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/> ",
        "value": "http://www.example.com/&gt "
      },
    ]);
  });
  it("should work with > in attr value", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/<img src=x>a " alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        "parsedUrl": "http://www.example.com/<img src=x>a ",
        "value": "http://www.example.com/<img src=x>a "
      },
    ]);
  });
});
