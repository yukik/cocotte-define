'use strict';
var def = require('../define');
var assert = require('assert');

var k;

// getter-setterなし
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = function () {
    return null;
  };

  assert.throws(function(){
    k = new Klass();
  });

})();


// getter-setterなし (2)
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = function () {
    return {type: String};
  };

  assert.throws(function(){
    k = new Klass();
  });

})();

