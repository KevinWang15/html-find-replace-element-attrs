const htmlFindSrc = require("../src");
const chai = require("chai");
const assert = chai.assert;

describe("replaceAsync", function () {
  it("should do async replacement correctly", async function () {
    assert.deepEqual(
      await htmlFindSrc.replaceAsync('...<img src="./abc.jpg">abc</img>...<img width=100 src="./hello.jpg">abc</img>...',
        _ => new Promise(resolve => {
          setTimeout(() => resolve(_.toUpperCase()), 1000)
        }),
      ), `...<img src="./ABC.JPG">abc</img>...<img width=100 src="./HELLO.JPG">abc</img>..`)
  });
});
