const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("replace", function () {
  it("should do replacement correctly", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...', "hi.jpg")
      , `...<img src="hi.jpg">abc</img>...<img width=100 src="hi.jpg">abc</img>..`);
  });
  it("should support callback function", function () {
    assert.deepEqual(
      htmlFindSrc.replace('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...', _=>_.toUpperCase())
      , `...<img src="./ABC.JPG">abc</img>...<img width=100 src="./HELLO.JPG">abc</img>..`);
  });
});
