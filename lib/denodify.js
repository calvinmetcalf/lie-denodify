var Promise = require('lie');
var argsarray = require('argsarray');
function makeNodeCallbackFor(resolve, reject) {
  return argsarray(function (args) {
    if (args[0]) {
      reject(args[0]);
    } else if (args.length > 2) {
      resolve(args.slice(1));
    } else {
      resolve(args[1]);
    }
  });
}
function denodify(func, context) {
    return argsarray(function(args) {
        return new Promise(function(resolve, reject) {
            Promise.all(args).then(function(args){
              args.push(makeNodeCallbackFor(resolve, reject));
              func.apply(context, args);
            });
        });
    });
}
module.exports = denodify;