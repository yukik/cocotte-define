'use strict';
var def = require('../define');
var assert = require('assert');

// getter setter
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    setter: function (val) {
      this.prop1_ = val;
    },
    getter: function () {
      return this.prop1_;
    }
  });

  var k = new Klass();

  assert(k.prop1 === void 0);

  var ps = [];
  for(var p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }

  assert.deepEqual(ps, ['value']);

  k.prop1 = 'foo';
  assert(k.prop1_ === 'foo');
  ps = [];
  for(p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['value', 'prop1_']);

})();


// setterのみ
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    setter: function (val) {
      this.prop1_ = val;
    }
  });

  var k = new Klass();
  k.prop1 = 'foo';

  var x;
  assert.throws(function(){
    x = k.prop1;
  });

})();


// setterのみ
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    getter: function () {
      return this.prop1_;
    }
  });

  var k = new Klass();

  k.prop1_ = 'foo';

  assert.throws(function(){
    k.prop1 = 'bar';
  });

})();
