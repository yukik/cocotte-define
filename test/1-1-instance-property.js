'use strict';
var def = require('../define');
var assert = require('assert');

var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {type: String};
var k = new Klass();

assert.throws(function (){
  k.name = 123;
});

assert(null === k.name);

k.name = 'foo';
assert('foo' === k.name);

k.name = null;
assert(null === k.name);

k.name = void 0;
assert(null === k.name);




