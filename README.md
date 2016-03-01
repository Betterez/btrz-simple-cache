# btrz-simple-cache

**Very simple** Redis backed cache

## Engines

io.js >= v2.0.1 node > 4.0

## Change log

  * 1.0.1 - First release

## General usage

The api is very simple and fluent.

    let Cache = require("btrz-simple-cache").Cache,
      RedisCache = require("btrz-simple-cache").RedisCache;

    let cache = new Cache(new RedisCache(redisConfig), options);

    cache.set(key, obj); //saves to cache using the default ttl set by options or 60 seconds

    //Set returns a promise with the obj as the result
    cache.set(key, obj, 200); //saves to cache using 200 seconds as the ttl

    //Get returns a promise with the value for the key
    cache.get(key)
      .then(function (value) {
        //do something with the value
      });

    //Del removes the object for the given key, returns a promise just for consistency
    cache.del(key)
      .then(function () {
        //Do something else
      });

    // Flush removes all objects in cache using the prefix set on options, or the default 'cache'
    // Returns a promise with the count of removed objects
    cache.flush()
      .then(function (count) {
        //count is the number of entries removed;
      });

### Options

`.prefix` (defaults to 'cache'), this will we appended in front of all keys separated by a '-'

`.ttl` (default to 60 seconds), this will be given to `set` if a ttl is not provided when `set` is call

### Redis configuration

`.host` (a host running Redis)
`.port` The port to connect to redis
`.pass` A password to connect to Redis (if needed)
