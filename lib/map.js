var use = require('lie-use');
var all = require('lie-all');
var qMap = require('./quickMap');
var resolve = require('lie-resolve');
function map(array, func) {
    return use(array,function(arr){
        return all(qMap(arr,function(a){
            return resolve(a).then(function(b){
                return func(b);
            });
        }));
    });
}
module.exports = map;