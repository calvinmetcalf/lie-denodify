'use strict';
var denodify = require('../lib/denodify');
var Promise = require('lie');
require("mocha-as-promised")();
var chai = require("chai");
chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
describe("denodify",function(){
    describe('singleValue',function(){
        var nodeLike = denodify(function(a,cb){
            if(typeof a === 'number'){
                cb(null,a);
            }else if(typeof a === 'string'){
                cb(a);
            }
        });
        describe('plain values', function () {
            it('should work',function(){
                return nodeLike(5).should.become(5);
            });
            it('should throw',function(){
                return nodeLike('boo').should.be.rejected.and.become('boo');
            });
        });
         describe('promise values', function () {
            it('should work',function(){
                return nodeLike(Promise.resolve(5)).should.become(5);
            });
            it('should throw',function(){
                return nodeLike(Promise.resolve('boo')).should.be.rejected.and.become('boo');
            });
        });
    });
    describe('multivalue',function(){
        var nodeLike = denodify(function(a,b,cb){
            if(typeof a === 'number'&&typeof b === 'number'){
                cb(null,a+b);
            }else if(typeof a === 'number'&&typeof b === 'function'){
                b(null,a);
            }else if(typeof a === 'string'){
                if(typeof b === 'function'){
                    b(a);
                }else{
                    cb(a);
                }
            }else if(typeof b === 'string'){
                cb(b);
            }else if(typeof a === 'function'){
                a('need a value');
            }
        });
        it('should work',function(){
            return nodeLike(5).should.become(5);
        });
        it('should work with 2 numbers',function(){
            return nodeLike(2, 3).should.become(5);
        });
        it('should work with a number and a string',function(){
            return nodeLike(2,'boo').should.be.rejected.and.become('boo');
        });
        it('should work with a number and a string',function(){
            return nodeLike('boo').should.be.rejected.and.become('boo');
        });
        it('should work with a no arguments',function(){
            return nodeLike().should.be.rejected.and.become('need a value');
        });
    });
    describe('callback with multiple values', function () {
        var nodeLike = denodify(function (a, cb) {
            cb(null, a, this.other);
        }, {other: 9});
        var nodeLike2 = denodify(function (a, b, cb) {
            cb(null, a + b);
        });
        it('should work', function () {
            return nodeLike(3).should.become([3, 9]);
        });
        it('should work with a promise', function () {
            return nodeLike(Promise.resolve(3)).should.become([3, 9]);
        });
        it('should work when called with multiple values', function () {
            var nineP = Promise.resolve(9);
            var obj = {
                then: nineP.then.bind(nineP)
            };
            return nodeLike2(Promise.resolve(3), obj).should.become(12);
        });
        it('should work when called with multiple values with the fake promise first', function () {
            var nineP = Promise.resolve(9);
            var obj = {
                then: nineP.then.bind(nineP)
            };
            return nodeLike2(obj, Promise.resolve(3)).should.become(12);
        });
    });
});