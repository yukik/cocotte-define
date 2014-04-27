'use strict';
var def = require('../define');
var assert = require('assert');

// 正しくない設定1
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setMethod('meth1', {});
  });
})();

// 正しくない設定2
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setMethod('meth1', function (val) {
      this.prop1 = val;
    });
  });
})();

// 正しくない設定3
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setMethod('meth1', {
      method: function (val) {
        this.prop1 = val;
      }
    });
  });
})();
