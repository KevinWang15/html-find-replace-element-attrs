const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("replaceAsync", function () {
  it("should do async replacement correctly", async function () {
    assert.deepEqual(
      await htmlFindSrc.replaceAsync('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...',
        _ => new Promise(resolve => {
          setTimeout(() => resolve(_.value.toUpperCase()), 1000)
        }), {
          tag: "img",
          attr: "src",
        },
      ), `...<img src="./ABC.JPG">abc</img>...<img width=100 src="./HELLO.JPG">abc</img>..`)
  });
  it("should be able to work with parseUrl", async function () {
    assert.deepEqual(
      await htmlFindSrc.replaceAsync('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...',
        _ => new Promise(resolve => {
          setTimeout(() => resolve(_.parsedUrl), 1000)
        }), {
          parseAttrValueAsUrl: true,
          baseUrl: "http://example.com",
          tag: "img",
          attr: "src",
        },
      ), `...<img src="http://example.com/abc.jpg">abc</img>...<img width=100 src="http://example.com/hello.jpg">abc</img>..`)
  });
});
