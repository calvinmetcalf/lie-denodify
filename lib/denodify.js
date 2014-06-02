'use strict';
var Promise = require('lie');
function denodify (nodefn) {
  return denodified;
  function denodified() {
    var self = this;
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
      return new Promise(function(resolve, reject) {
        args[l] = function(err, val) {
              if (err) {
                reject(err);
              } else {
                resolve(val);
              }
          };
          nodefn.apply(self, args);
      });
    } else {
      return Promise.all(args).then(function (args) {
        return new Promise(function(resolve, reject) {
          args[l] = function(err, val) {
                if (err) {
                  reject(err);
                } else {
                  resolve(val);
                }
            };
            nodefn.apply(self, args);
        });
      });
    }
  };
}
module.exports = denodify;