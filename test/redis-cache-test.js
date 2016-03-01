"use strict";

describe("RedisCache", function () {

  let RedisCache = require("../src/redis-cache").RedisCache,
    expect = require("chai").expect;

  describe("Constructor", function () {

    it("should throw if no options", function () {
      function sut() {
        new RedisCache();
      }
      expect(sut).to.throw("Please provide connection options with host port and (if needed) password to connect to a Redis server");
    });

    it("should throw if options doesn't contain a host", function () {
      function sut() {
        new RedisCache({});
      }
      expect(sut).to.throw("Please provide connection options with host port and (if needed) password to connect to a Redis server");
    });

    it("should throw if options doesn't contain a port", function () {
      function sut() {
        new RedisCache({host: "127.0.0.1"});
      }
      expect(sut).to.throw("Please provide connection options with host port and (if needed) password to connect to a Redis server");
    });

    it("should throw if options doesn't contain a port", function () {
      function sut() {
        new RedisCache({host: "127.0.0.1", port: 6379});
      }
      expect(sut).to.throw("Please provide connection options with host port and (if needed) password to connect to a Redis server");
    });

    it("should have a configured client as a promise", function (done) {
      let cache = new RedisCache({host: "localhost", port: 6379, pass: ""});
      cache.client.then(function (client) {
        expect(client.domain).not.to.be.undefined;
        done();
      })
      .catch(function (err) {
        done(err);
      });
    });
  });

  describe("#set", function () {

  });
});