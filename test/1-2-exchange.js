'use strict';
var def = require('../define');
var assert = require('assert');

var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {
  exchange: {
    from: Number,
    to: function (val) {
      return 'A' + val;
    }
  },
  type: String
};
var k = new Klass();

k.name = 'foo';
assert('foo' === k.name);

k.name = 123;
assert('A123' === k.name);

k.name = null;
assert(null === k.name);

k.name = void 0;
assert(null === k.name);


var Klass2 = function Klass2() {
  this.def(Klass2);
};
def(Klass2);
Klass2.properties.name = {
  exchange: [{
    from: Number,
    to: function (val) {
      return 'A' + val;
    }
  },
  {
    from: Number,
    to: function (val) {
      return 'B' + val;
    }
  },
  {
    from: String,
    to: function (val) {
      return 'C' + val;
    }
  }
  ],
  type: String
};
var k2 = new Klass2();

k2.name = 'foo';
assert('Cfoo' === k2.name);

k2.name = 123;
assert('A123' === k2.name);

k2.name = null;
assert(null === k2.name);

k2.name = void 0;
assert(null === k2.name);


