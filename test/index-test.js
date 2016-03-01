"use strict";

describe("Create logger", function () {

  let Cache = require("../index").Cache,
    expect = require("chai").expect,
    provider;

  beforeEach(function () {
    provider = {set: function() {}, get: function() {}, del: function() {}, flush: function() {}};
  });

  describe("Constructor", function () {

    it("should fail is a provider is not provided", function () {
      function sut() {
        return new Cache();
      }
      expect(sut).to.throw("Please provide a valid cache provider");
    });

    it("should be a provider that can handle set", function () {
      function sut() {
        return new Cache({});
      }
      expect(sut).to.throw("Please provide a valid cache provider");
    });

    it("should be a provider that can handle get", function () {
      function sut() {
        return new Cache({set: function() {}});
      }
      expect(sut).to.throw("Please provide a valid cache provider");
    });

    it("should a provider that can handle del", function () {
      function sut() {
        return new Cache({set: function() {}, get: function() {}});
      }
      expect(sut).to.throw("Please provide a valid cache provider");
    });

    it("should be a provider that can handle flush", function () {
      function sut() {
        return new Cache({set: function() {}, get: function() {}, del: function() {}});
      }
      expect(sut).to.throw("Please provide a valid cache provider");
    });

    it("should not throw if provider is valid", function () {
      function sut() {
        return new Cache(provider);
      }
      expect(sut).to.not.throw("Please provide a valid cache provider");
    });

    it("should set a default ttl if not provided", function () {
      var cache = new Cache(provider);
      expect(cache.ttl).to.be.eql(60);
    });

    it("should set a default prefix if not provided", function () {
      var cache = new Cache(provider);
      expect(cache.prefix).to.be.eql("cache");
    });

    it("should set a default ttl if ttl is NaN", function () {
      var cache = new Cache(provider, {ttl: "ahjk"});
      expect(cache.ttl).to.be.eql(60);
    });

    it("should set default ttl to value provided", function () {
      var cache = new Cache(provider, {ttl: 22});
      expect(cache.ttl).to.be.eql(22);
    });

    it("should set default prefix to value provided", function () {
      var cache = new Cache(provider, {ttl: 22, prefix: "p2"});
      expect(cache.prefix).to.be.eql("p2");
    });
  });

  describe("#set", function () {

    it("should call .set on the provider", function () {
      provider.set = function (k, v, t) {
        expect(k).to.be.eql("cache-key");
        expect(v).to.be.eql("value");
        expect(t).to.be.eql(40);
      }
      var cache = new Cache(provider);
      cache.set("key", "value", 40);
    });

    it("should call .set on the provider with default ttl", function () {
      provider.set = function (k, v, t) {
        expect(k).to.be.eql("cache-key");
        expect(v).to.be.eql("value");
        expect(t).to.be.eql(60);
      }
      var cache = new Cache(provider);
      cache.set("key", "value");
    });


    it("should call .set on the provider with default ttl it isNaN", function () {
      provider.set = function (k, v, t) {
        expect(k).to.be.eql("cache-key");
        expect(v).to.be.eql("value");
        expect(t).to.be.eql(60);
      }
      var cache = new Cache(provider);
      cache.set("key", "value", "nan");
    });

    it("should call .set on the provider with ttl from constructor", function () {
      provider.set = function (k, v, t) {
        expect(k).to.be.eql("cache-key");
        expect(v).to.be.eql("value");
        expect(t).to.be.eql(35);
      }
      var cache = new Cache(provider, {ttl: 35});
      cache.set("key", "value");
    });

  });

  describe("#get", function () {

    it("should call .get on the provider", function () {
      provider.get = function (k) {
        return `${k}-value`;
      }
      var cache = new Cache(provider);
      expect(cache.get("key")).to.be.eql("cache-key-value");
    });
  });

  describe("#del", function () {

    it("should call .del on the provider", function () {
      provider.del = function (k) {
        return `${k}-del`;
      }
      var cache = new Cache(provider);
      expect(cache.del("key")).to.be.eql("cache-key-del");
    });
  });

  describe("#flush", function () {

    it("should call .flush on the provider", function () {
      provider.flush = function (prefix) {
        return prefix;
      }
      var cache = new Cache(provider);
      expect(cache.flush()).to.be.eql("cache");
    });
  });
});