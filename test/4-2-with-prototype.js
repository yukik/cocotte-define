'use strict';
var def = require('../define');
var assert = require('assert');

var SuperSuperKlass = function SuperSuperKlass(prop1) {
  this.def(SuperSuperKlass);
  this.prop1 = prop1;
};
def(SuperSuperKlass);
SuperSuperKlass.properties.prop1 = {type: String};
SuperSuperKlass.methods.setProp1 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop1 = val;
    }
  };
};
SuperSuperKlass.prototype.getProp1 = function () {
  return this.prop1;
};

// ------------- スーパークラス定義
var SuperKlass = function SuperKlass(prop1, prop2) {
  this.def(SuperKlass, prop1);
  this.prop2 = prop2;
};
def(SuperKlass, SuperSuperKlass);
SuperKlass.properties.prop2 = {type: String};
SuperKlass.methods.setProp2 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop1 = val;
    }
  };
};
SuperKlass.prototype.getProp2 = function () {
  return this.prop2;
};


// ------------- サブクラス定義
var Klass = function Klass(prop1, prop2, prop3) {
  this.def(Klass, prop1, prop2);
  this.prop3 = prop3;
};
def(Klass, SuperKlass);
Klass.properties.prop3 = {type: String};
Klass.methods.setProp3 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop3 = val;
    }
  };
};
Klass.prototype.getProp3 = function () {
  return this.prop3;
};

// test
var k = new Klass('foo', 'bar', 'baz');

assert(k.prop1 === 'foo');
assert(k.prop2 === 'bar');
assert(k.prop3 === 'baz');

assert.deepEqual(k.value, {prop1: 'foo', prop2: 'bar', prop3: 'baz'});

var ps = [];
for(var p in k) {
  if (k.hasOwnProperty(p)) {
    ps.push(p);
  }
}
assert.deepEqual(ps, ['prop1', 'setProp1', 'prop2', 'setProp2', 'prop3', 'setProp3', 'value']);

var proto1 = Object.getPrototypeOf(k);
ps = [];
for(var p in proto1) {
  if (proto1.hasOwnProperty(p)) {
    ps.push(p);
  }
}
assert.deepEqual(ps, ['def', 'getProp3']);
assert(proto1.constructor === Klass);

var proto2 = Object.getPrototypeOf(proto1);
ps = [];
for(var p in proto2) {
  if (proto2.hasOwnProperty(p)) {
    ps.push(p);
  }
}
assert.deepEqual(ps, ['def', 'getProp2']);
assert(proto2.constructor === SuperKlass);

var proto3 = Object.getPrototypeOf(proto2);
ps = [];
for(var p in proto3) {
  if (proto3.hasOwnProperty(p)) {
    ps.push(p);
  }
}
assert.deepEqual(ps, ['def', 'getProp1']);
assert(proto3.constructor === SuperSuperKlass);











