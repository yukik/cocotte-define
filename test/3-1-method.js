'use strict';
var def = require('../define');
var assert = require('assert');

// method
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.methods.setName = function (pv) {
    return function (val) {
      pv.name = val;
    };
  };
  Klass.methods.getName = function (pv) {
    return function () {
      return pv.name;
    };
  };
  var k = new Klass();

  assert(k.getName() === void 0);

  k.setName('foo');
  assert(k.getName() === 'foo');

  k.setName();
  assert(k.getName() === void 0);

  k.setName(null);
  assert(k.getName() === null);

  k.setName(void 0);
  assert(k.getName() === void 0);

})();