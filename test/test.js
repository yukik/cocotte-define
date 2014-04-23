'use strict';
var def = require('../define');
var assert = require('assert');

var Klass = function Klass (str1, num1) {
  this.def(Klass);
  this.str1 = str1;
  this.num1 = num1;
};
def(Klass);
Klass.properties.str1 = {type: String};
Klass.properties.str2 = function (pv) {
  return {
    getter: function () {
      return pv.str2 || null;
    },
    setter: function (val) {
      if (val === null || val === void 0 || typeof val === 'string') {
        pv.str2 = val;
      } else {
        throw new TypeError('引数が文字列ではありません');
      }
    }
  };
};
Klass.properties.num1 = {type: Number};
Klass.properties.num2 = function (pv) {
  return {
    getter: function () {
      return pv.num2;
    },
    setter: function (val) {
      if (1 <= val && val <= 100) {
        pv.num2 = val;
      } else {
        throw new TypeError('1から100までの数字を設定してください');
      }
    }
  };
};
Klass.methods.m1 = function (pv) {
  return function (val) {
    this.num1 = pv.num1 ? pv.num1 + val : val;
  };
};
Klass.methods.m2 = function (pv) {
  return {
    params: [Number],
    method: function (val) {
      this.num2 = pv.num2 ? pv.num2 + val : val;
    }
  };
};

var k = new Klass('foo', 10);

// --- test

assert(k.str1 === 'foo');

k.str1 = 'bar';

assert(k.str1 === 'bar');

assert.throws(function(){
  k.str1 = 123;
}, TypeError);

assert(k.str2 === null);

k.str2 = 'piyo';

assert(k.str2 === 'piyo');

assert.throws(function(){
  k.str2 = 123;
}, TypeError);

// TODO 続きは後日

console.log('test success');
