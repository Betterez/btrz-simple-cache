"use strict";

function validTimeToLive(ttl, _ttl) {
  return (!ttl || isNaN(ttl)) ? _ttl : ttl;
}

function getKey(prefix, key) {
  return `${prefix}-${key}`;
}

class Cache {

  constructor(provider, options) {
    let _ttl = 60;

    if (!provider ||
      !provider.set ||
      !provider.get ||
      !provider.del ||
      !provider.flush) {
      throw new Error("Please provide a valid cache provider");
    }

    this.provider = provider;
    this.ttl = validTimeToLive((options || {}).ttl, _ttl);
    this.prefix = (options || {}).prefix || "cache";
  }

  set(key, value, ttl) {
    this.provider.set(getKey(this.prefix, key), value, validTimeToLive(ttl, this.ttl));
  }

  get(key) {
    return this.provider.get(getKey(this.prefix, key));
  }

  del(key) {
    return this.provider.del(getKey(this.prefix, key));
  }

  flush() {
    return this.provider.flush(this.prefix);
  }
}

exports.Cache = Cache;