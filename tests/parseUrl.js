const parseUrl = require("../src/utils/parseUrl");
const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;

describe("parseUrl", function () {
  it("should parse a full URL", function () {
    assert.deepEqual(parseUrl("http://www.example.com/"), "http://www.example.com/");
  });
  it("should parse protocol-relative URL", function () {
    assert.deepEqual(parseUrl("//www.example.com/", { urlProtocol: "https" }), "https://www.example.com/");
    assert.deepEqual(parseUrl("//www.example.com/", { urlProtocol: "ftp:" }), "ftp://www.example.com/");
  });
  it("should throw when parsing a relative URL without baseUrl", function () {
    expect(() => parseUrl("/a.txt")).to.throw('baseUrl must be set to parse a relative url');
  });
  it("should parse relative URL", function () {
    assert.deepEqual(parseUrl("/a.txt", { baseUrl: "ftp://www.example.com" }), "ftp://www.example.com/a.txt");
    assert.deepEqual(parseUrl("/a.txt", { baseUrl: "ftp://www.example.com/" }), "ftp://www.example.com/a.txt");
    assert.deepEqual(parseUrl("./a.txt", { baseUrl: "ftp://www.example.com/" }), "ftp://www.example.com/a.txt");
    assert.deepEqual(parseUrl("../a.txt", { baseUrl: "ftp://www.example.com/a/b/c/" }), "ftp://www.example.com/a/b/a.txt");
    assert.deepEqual(parseUrl("/a.txt", { baseUrl: "ftp://www.example.com/" }), "ftp://www.example.com/a.txt");
  });
  it("should set url protocol correctly from baseUrl", function () {
    assert.deepEqual(parseUrl("//www.example.com/", { baseUrl: "ftp://www.example.com/" }), "ftp://www.example.com/");
  });
});
