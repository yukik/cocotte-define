'use strict';
var def = require('../define');
var assert = require('assert');

(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setMethod('meth1', {
    params: [String],
    method: function (val) {
      this.prop1 = val;
    }
  });

  var k = new Klass();

  var ps = [];
  for(var p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['value']);

  k.meth1('foo');

  ps = [];
  for(p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['value', 'prop1']);

  assert(k.prop1 === 'foo');

  k.meth1(void 0);
  assert(k.prop1 === void 0);

  k.meth1(null);
  assert(k.prop1 === null);

  assert.throws(function() {
    k.meth1();
  });

  assert.throws(function() {
    k.meth1(123);
  });

  assert.throws(function() {
    k.meth1('foo', 'bar');
  });

})();

// Array String
(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setMethod('meth1', {
    params: [[String]],
    method: function (val) {
      this.prop1 = val;
    }
  });

  var k = new Klass();

  k.meth1(['foo', 'bar', 'baz']);
  assert.deepEqual(k.prop1, ['foo', 'bar', 'baz']);

  k.meth1([]);
  assert.deepEqual(k.prop1, []);

  k.meth1(void 0);
  assert(k.prop1 === void 0);

  k.meth1(null);
  assert(k.prop1 === null);


  assert.throws(function() {
    k.meth1([1, 2, 3]);
  });

  assert.throws(function() {
    k.meth1();
  });

  assert.throws(function() {
    k.meth1('foo', 'bar');
  });

})();