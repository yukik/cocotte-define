'use strict';
var def = require('../define');
var assert = require('assert');

// 文字列
(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', 'string');
  });
})();

// typeなし
(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', {});
  });
})();

// type null
(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', null);
  });
})();

// type String
(function() {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', String);
  });
})();