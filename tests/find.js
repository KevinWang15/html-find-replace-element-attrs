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
          quoteType: "\"",
          index: 13,
        },
        {
          "index": 58,
          quoteType: "\"",
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
          quoteType: "'",
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
          quoteType: "'",
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
          quoteType: "'",
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
          quoteType: "'",
          "index": 23,
        },
      ]);
  });
  it("should throw when tag is not set", function () {
    expect(
      () => htmlFindSrc.find(
        "...<img src=helloworld=aaa>abc</img>...",
        { attr: "src" },
      )).to.throw("tag is required");
  });
  it("should throw when attr is not set", function () {
    expect(
      () => htmlFindSrc.find(
        "...<img src=helloworld=aaa>abc</img>...",
        { tag: "img" },
      )).to.throw("attr is required");
  });
  it("should throw when encountering unexpected =", function () {
    expect(
      () => htmlFindSrc.find(
        "...<img src=helloworld=aaa>abc</img>...",
        { tag: "img", attr: "src" },
      )).to.throw("unexpected =");
  });
  it("should be able to handle = in quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./1=2.jpg"/>', { tag: "img", attr: "src" }), [{
      value: './1=2.jpg',
      quoteType: "\"",
      index: 13,
    }]);
  });
  it("should be able to handle cases without quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=abc.jpg width=100/>', {
      tag: "img",
      attr: "src",
    }), [{
      value: 'abc.jpg',
      quoteType: " ",
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
        quoteType: " ",
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
        quoteType: " ",
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
        quoteType: "\"",
        "parsedUrl": "http://www.example.com/%E5%95%8A%20啊a·.png",
        "value": "http://www.example.com/%E5%95%8A%20啊a&#183;.png",
      },
    ]);
  });
  it("should work with special html entities", function () {
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&clubs;/&quot;.png" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        quoteType: "\"",
        "parsedUrl": "http://www.example.com/♣/\".png",
        "value": "http://www.example.com/&clubs;/&quot;.png"
      },
    ]);
    assert.deepEqual(htmlFindSrc.find('...<div class="my-class"><img src="http://www.example.com/&quot.png" alt=""></div>', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 35,
        quoteType: "\"",
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
        quoteType: "\"",
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
        quoteType: "\"",
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
        quoteType: "\"",
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
        quoteType: "\"",
        "parsedUrl": "http://www.example.com/<img src=x>a ",
        "value": "http://www.example.com/<img src=x>a "
      },
    ]);
  });
  it("should work in spite of lots of \\w", function () {

    assert.deepEqual(
      htmlFindSrc.find(
        "...<img src = './hello.jpg'>abc</img>...",
        { tag: "img", attr: "src" },
      ),
      [
        {
          quoteType: "'",
          value: "./hello.jpg",
          index: 15,
        },
      ]);

    assert.deepEqual(
      htmlFindSrc.find(
        "...<img src =\n './hello.jpg'>abc</img>...",
        { tag: "img", attr: "src" },
      ),
      [
        {
          quoteType: "'",
          value: "./hello.jpg",
          index: 16,
        },
      ]);
    assert.deepEqual(
      htmlFindSrc.find(
        "...<img src =\n ./hello.jpg b>abc</img>...",
        { tag: "img", attr: "src" },
      ),
      [
        {
          quoteType: " ",
          value: "./hello.jpg",
          index: 15,
        },
      ]);

    assert.deepEqual(htmlFindSrc.find('...<div class="my-class">\n<img \nsrc="http://\nwww.example.com/<img src=x>a "\t\n alt=""></div><img \nsrc="http://\nwww.example.com/<img src=xa "\n\n alt="">', {
      parseAttrValueAsUrl: true,
      tag: "img", attr: "src",
    }), [
      {
        "index": 37,
        quoteType: "\"",
        "parsedUrl": "http://\nwww.example.com/<img src=x>a ",
        "value": "http://\nwww.example.com/<img src=x>a ",
      },
      {
        "index": 102,
        quoteType: "\"",
        "parsedUrl": "http://\nwww.example.com/<img src=xa ",
        "value": "http://\nwww.example.com/<img src=xa ",
      }
    ]);
  });
});
