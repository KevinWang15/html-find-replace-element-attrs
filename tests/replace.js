const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("replace", function () {
  it("should do replacement correctly", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...', "hi.jpg", {
        tag: "img",
        attr: "src",
      })
      , `...<img src="hi.jpg">abc</img>...<img width=100 src="hi.jpg">abc</img>...`,
    );
    assert.deepEqual(
      htmlFindSrc.replace('<div><img src=../a.jpg alt=\'\'><img src=\'/b.jpg\' alt=\'\'></div>', "http://www.abc.com/1.jpg", {
        tag: "img",
        attr: "src",
      })
      , `<div><img src=http://www.abc.com/1.jpg alt=''><img src='http://www.abc.com/1.jpg' alt=''></div>`,
    );
  });
  it("should support callback function", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...', _ => _.value.toUpperCase(), {
        tag: "img",
        attr: "src",
      })
      , `...<img src="./ABC.JPG">abc</img>...<img width=100 src="./HELLO.JPG">abc</img>...`);
  });
  it("should be able to work with parseUrl", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...', _ => _.parsedUrl, {
        parseAttrValueAsUrl: true,
        baseUrl: "http://example.com",
        tag: "img", attr: "src",
      })
      , `...<img src="http://example.com/abc.jpg">abc</img>...<img width=100 src="http://example.com/hello.jpg">abc</img>...`);
  });
  it("should automatically add quotes sometimes", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src=abc.jpg>abc</img>...', "hello world.jpg", {
        tag: "img", attr: "src",
      })
      , `...<img src="hello world.jpg">abc</img>...`);
  });
});
