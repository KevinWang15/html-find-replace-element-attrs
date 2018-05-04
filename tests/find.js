const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("find", function () {
  it("should find all occurrences of src in an html string", function () {
    assert.deepEqual(htmlFindSrc.find('...<img src="./hello.jpg"/>...'), ["./hello.jpg"]);
  });
});
