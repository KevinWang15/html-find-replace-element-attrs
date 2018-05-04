const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("find", function () {
  it("should find all occurrences of src in an html string", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./hello.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...'), ["./hello.jpg"]);
  });
  it("should be able to handle = in quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./1=2.jpg"/>'), ["./1=2.jpg"]);
  });
  it("should be able to handle cases without quotes", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src=abc.jpg width=100/>'), ["abc.jpg"]);
  });
});
