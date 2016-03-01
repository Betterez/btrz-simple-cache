"use strict";

describe("RedisCache", function () {

  let RedisCache = require("../index").RedisCache,
    expect = require("chai").expect,
    config = {host: "localhost", port: 6379, pass: ""};

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
      let cache = new RedisCache(config);
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

    it("should set the key with the given ttl", function (done) {
      let cache = new RedisCache(config),
        key = "cache-test-set",
        value= "testing test set";
      cache
        .set(key, value, 1)
        .then(function (result) {
          expect(result).to.be.eql(value);
          setTimeout(function () {
            cache.get(key)
              .then(function (val) {
                expect(val).to.be.null;
                done();
              })
              .catch(function (err) {
                done(err);
              });
          }, 2*1000);
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("should set the key with the given ttl", function (done) {
      let cache = new RedisCache(config),
        key = "cache-test-set2",
        value = "testing test set";
      cache
        .set(key, value, 1)
        .then(function (result) {
          expect(result).to.be.eql(value);
          setTimeout(function () {
            cache.get(key)
              .then(function (val) {
                expect(val).to.be.eql(value);
                done();
              })
              .catch(function (err) {
                done(err);
              });
          }, 500);
        })
        .catch(function (err) {
          done(err);
        });
    });

  });

  describe("#del", function () {

    it("should remove the value", function (done) {
      let cache = new RedisCache(config),
        value = "testing test set",
        key = "cache-test-del";
      cache
        .set(key, value, 30)
        .then(function (result) {
          cache.del(key)
            .then(function () {
              cache.get(key)
                .then(function (val) {
                  expect(val).to.be.null;
                  done();
                })
                .catch(function (err) {
                  done(err);
                });
            });
        })
        .catch(function (err) {
          done(err);
        });
    });
  });


  describe("#flush", function () {

    it("should remove all values with the prefix", function (done) {
      let cache = new RedisCache(config),
        value = "testing test flush",
        key = "cache-test-flush",
        prefix = "cache";
      cache
        .set(key, value, 30)
        .then(function (result) {
          cache.flush(prefix)
            .then(function (count) {
              expect(count).to.not.be.eql(0);
              cache.get(key)
                .then(function (val) {
                  expect(val).to.be.null;
                  done();
                })
                .catch(function (err) {
                  done(err);
                });
            });
        })
        .catch(function (err) {
          done(err);
        });
    });
  });
});