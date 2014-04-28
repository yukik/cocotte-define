'use strict';
var def = require('../define');
var assert = require('assert');

// 単数のexchange
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.prop1 = {
  exchange: {
    from: Array,
    item: Number,
    to: function (val) {
      return val.join('-');
    }
  },
  type: String
};
var k = new Klass();

k.prop1 = 'foo';
assert('foo' === k.prop1);

k.prop1 = [1, 2, 3];
assert('1-2-3' === k.prop1);

assert.throws(function(){
  k.prop1 = 1;
});

assert.throws(function(){
  k.prop1 = ['foo', 'bar', 'baz'];
});

k.prop1 = null;
assert(null === k.prop1);

k.prop1 = void 0;
assert(null === k.prop1);

assert.throws(function() {
  k.prop1 = true;
});