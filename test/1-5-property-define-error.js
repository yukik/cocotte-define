'use strict';
var def = require('../define');
var assert = require('assert');

// 文字列
(function (){

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = 'string';

  assert.throws(function () {
    var k = new Klass();
    k.prop1 = 123;
  });
  
})();

// typeなし 
(function (){
  
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = {};

  assert.throws(function (){
    var k = new Klass();
    k.prop1 = 123;
  });

})();

// type null
(function (){

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = {type: null};

  assert.throws(function () {
    var k = new Klass();
    k.prop1 = 123;
  });
  
})();

// type String
(function (){

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = String;

  assert.throws(function () {
    var k = new Klass();
    k.prop1 = 123;
  });
  
})();


// type Object
(function (){

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.prop1 = {type: Object};

  var k = new Klass();

  k.prop1 = {};
  assert.deepEqual(k.prop1, {});

  k.prop1 = new Date('1999-9-9');
  assert.deepEqual(k.prop1, new Date('1999-9-9'));
  
  k.prop1 = null;
  assert(k.prop1 === null);

  k.prop1 = void 0;
  assert(k.prop1 === null);

  assert.throws(function(){
    k.prop1 = 'abc';
  });

  assert.throws(function(){
    k.prop1 = 123;
  });

  assert.throws(function(){
    k.prop1 = true;
  });

})();


