'use strict';
var def = require('../define');
var assert = require('assert');

// {}
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', {});
  });
})();

// null
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', null);
  });
})();

// String
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', String);
  });
})();


// item: String 
(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  assert.throws(function(){
    Klass.setProperty('prop1', {type: String, item: String});
  });
})();