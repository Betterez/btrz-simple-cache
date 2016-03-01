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
}

exports.RedisCache = RedisCache;

exports.create = function (options, logger) {
  let prefix = (options && options.prefix) ? options.prefix : "cache-";

  function logErr(msg, args) {
    if (logger && logger.error) {
      logger.error(msg, args);
    }
  }

  function throwErr(err) {
    if (err) { throw err; }
  }

  function connect() {
    if (!client) {
      client = new redis.createClient(options.port, options.host);
      client.auth(options.pass, throwErr);
    }
  }

  return {
    close: function () {
      try {
        connect();
        client.quit();
      } catch (e) {
        logErr('cache-redis::close', [e]);
      }
    },
    get: function (key, cb) {
      try {
        connect();
        client.get(prefix + key, function (err, result) {
          cb(err, JSON.parse(result));
        });
      } catch (e) {
        logErr('cache-redis::get', [e, key]);
        if (cb) {
          cb(e, null);
        }
      }
    },
    set: function (key, obj, cb, lifetime) {
      try {
        if (arguments.length < 2) {
          logErr("cache-redis::set - missing arguments ", arguments);
          return;
        }

        if (cb && (!isNaN(cb))) {
          lifetime = cb;
          cb = null;
        }

        if (!cb) {
          cb = function () {}; //No callback
        }

        connect();
        client.set(prefix + key, JSON.stringify(obj), cb);

        if (lifetime) {
          client.expire(prefix + key, lifetime);
        }

      } catch (e) {
        logErr('cache-redis::set', [e, arguments]);
        if (cb) {
          cb(e, null);
        }
      }
    },
    flush: function (cb) {
      try {
        connect();
        client.keys(prefix + '*', function (err, result) {
          if (result && result.length > 0) {
            client.del(result, cb);
          } else {
            cb(null, 0);
          }
        });
      } catch (e) {
        logErr('cache-redis::remove', [e]);
        if (cb) {
          cb(e, null);
        }
      }
    },
    remove: function (key, cb) {
      try {
        connect();
        client.del(prefix + key, cb);
      } catch (e) {
        logErr('cache-redis::remove', [e, key]);
        if (cb) {
          cb(e, null);
        }
      }
    },
    getStatus: function () {
      return client.connected;
    }
  };
};
