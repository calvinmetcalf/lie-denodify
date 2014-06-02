'use strict';
var Promise = require('lie');
module.exports = function denodify (nodefn, context) {
  return function denodified() {
    var self = context || this;
    var l = arguments.length;
    var args = new Array(l + 1);
    var promiseArgs = false;
    var i = -1;
    while (++i < l) {
      if (arguments[i] && typeof arguments[i].then === 'function') {
        promiseArgs = true;
      }
      args[i] = arguments[i];
    }
    if (!promiseArgs) {
      return new Promise(function denodifier(resolve, reject) {
        args[l] = function denodifyCallback(err, val) {
          var len = arguments.length;
          if (err) {
            reject(err);
          } else if (len < 3) {
            resolve(val);
          } else {
            var outArgs = new Array(len - 1);
            var i = 0;
            while (++i < len) {
              outArgs[i - 1] = arguments[i];
            }
            resolve(outArgs);
          }
        };
        nodefn.apply(self, args);
      });
    } else {
      return Promise.all(args).then( function afterAll(args) {
        return new Promise(function denodifier(resolve, reject) {
          args[l] = function denodifyCallback(err, val) {
            var len = arguments.length;
            if (err) {
              reject(err);
            } else if (len < 3) {
              resolve(val);
            } else {
              var outArgs = new Array(len - 1);
              var i = 0;
              while (++i < len) {
                outArgs[i - 1] = arguments[i];
              }
              resolve(outArgs);
            }
          };
          nodefn.apply(self, args);
        });
      });
    }
  };
}
