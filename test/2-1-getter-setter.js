'use strict';
var def = require('../define');
var assert = require('assert');

// getter有り、setter有り
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.prop1 = function (pv) {
  return {
    getter: function () {
      return pv.prop1;
    },
    setter: function (val) {
      pv.prop1 = val;
    }
  };
};

var k = new Klass();

assert(k.prop1 === void 0);

k.prop1 = 'foo';
assert(k.prop1 === 'foo');

k.prop1 = 123;
assert(k.prop1 === 123);

k.prop1 = void 0;
assert(k.prop1 === void 0);

k.prop1 = null;
assert(k.prop1 === null);

k.prop1 = 'bar';
assert.deepEqual(k.value, {prop1: 'bar'});


// getter有り、setterなし
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.prop0 = {type: String};
Klass.properties.prop1 = function (pv) {
  return {
    getter: function () {
      return pv.prop0;
    }
  };
};

var k = new Klass();
k.prop0 = 'foo';


assert(k.prop1 === 'foo');

assert.throws(function(){
  k.prop1 = 'bar';
});

assert.deepEqual(k.value, {prop0: 'foo', prop1: 'foo'});


// getterなし、setter有り
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.prop0 = {type: String};
Klass.properties.prop1 = function (pv) {
  return {
    setter: function (val) {
      return pv.prop0 = val;
    }
  };
};

var k = new Klass();
k.prop0 = 'foo';

assert.throws(function () {
  var x = k.prop1;
  console.log(x);
});

k.prop1 = 'bar';
assert(k.prop0 === 'bar');

assert.deepEqual(k.value, {prop0: 'bar'});