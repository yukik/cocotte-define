'use strict';
var def = require('../define');
var assert = require('assert');

var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = function (pv) {
  return {
    getter: function () {
      return pv.name;
    },
    type: String,
    setter: function (val) {
      pv.name = val;
    }
  };
};

var k = new Klass();

assert(k.name === null);

k.name = 'foo';
assert(k.name === 'foo', '型一致');

assert.throws(function(){
  k.name = 123;
}, '型不一致');

k.name = null;
assert(k.name === null);

k.name = void 0;
assert(k.name === null);