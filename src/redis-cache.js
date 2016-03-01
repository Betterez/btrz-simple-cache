"use strict";

let redis = require("redis"),
  client = null;

function createClient(options) {
  return new Promise(function (resolve, reject) {
    let client = redis.createClient(options.port, options.host);
    client.auth(options.pass, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

function getKey(client, key) {
  return new Promise(function (resolve, reject) {
    client.get(key, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(result));
      }
    });
  });
}

function delKey(client, key) {
  return new Promise(function (resolve, reject) {
    client.del(key, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function flushKeys(client, prefix) {
  return new Promise(function (resolve, reject) {
    client.keys(`${prefix}*`, function (err, results) {
      if (err) {
        reject(err);
      } else {
        if (results && results.length > 0) {
          client.del(results, function (errDel, count) {
            if (errDel) {
              reject(errDel);
            } else {
              resolve(count);
            }
          });
        } else {
          resolve(0);
        }
      }
    });
  });
}

class RedisCache {

  constructor(options) {
    if (!options ||
      !options.host ||
      !options.port ||
      options.pass === undefined) {
      throw new Error("Please provide connection options with host port and (if needed) password to connect to a Redis server")
    }
    this.options = options;
    this.client = createClient(this.options);
  }

  set(key, value, ttl) {
    return this.client
      .then(function (client) {
        client.set(key, JSON.stringify(value));
        client.expire(key, ttl);
        return value;
      });
  }

  get(key) {
    return this.client
      .then(function (client) {
        return getKey(client, key);
      });
  }

  del(key) {
    return this.client
      .then(function (client) {
        return delKey(client, key);
      });
  }

  flush(prefix) {
    return this.client
      .then(function (client) {
        return flushKeys(client, prefix);
      });
  }
}

exports.RedisCache = RedisCache;