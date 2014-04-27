'use strict';
var def = require('../define');
var assert = require('assert');

var k;

// 正しくない設定1
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.methods.setName = {};
  assert.throws(function(){
    k = new Klass();
  });
})();

// 正しくない設定2
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.methods.setName = function () {
    return {};
  };
  assert.throws(function(){
    k = new Klass();
  });
})();

// 正しくない設定3
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.methods.setName = function (pv) {
    return {
      method: function (val) {
        pv.name = val;
      }
    };
  };
  assert.throws(function(){
    k = new Klass();
  });
})();
