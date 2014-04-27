'use strict';
var def = require('../define');
var assert = require('assert');

// item指定
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.hobbies = {
    type: Array,
    item: String
  };
  var k = new Klass();

  assert(Array.isArray(k.hobbies), 'initial []');
  assert(k.hobbies.length === 0, 'initial []');

  k.hobbies = ['jogging', 'tennes'];
  assert(Array.isArray(k.hobbies));
  assert(k.hobbies.length === 2);

  k.hobbies = [];
  assert(Array.isArray(k.hobbies), '[] -> []');
  assert(k.hobbies.length === 0, '[] -> []');

  k.hobbies = null;
  assert(Array.isArray(k.hobbies), 'null -> []');
  assert(k.hobbies.length === 0, 'null -> []');

  k.hobbies = void 0;
  assert(Array.isArray(k.hobbies), 'void 0 -> []');
  assert(k.hobbies.length === 0, 'void 0 -> []');

  var hob = k.hobbies;
  hob.push('surfing');
  assert(hob.length === 1);
  assert(k.hobbies.length === 0, 'push -> []');

  assert.throws(function (){
    k.hobbies = 'jogging';
  });

  assert.throws(function(){
    k.hobbies = [1, 2, 3];
  });

  assert.throws(function(){
    k.hobbies = ['jogging', 'tennes', null];
  });

  assert.throws(function(){
    k.hobbies = [null];
  });

})();


// itemなし
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.hobbies = {
    type: Array
  };
  var k = new Klass();

  assert(Array.isArray(k.hobbies), 'initial []');
  assert(k.hobbies.length === 0, 'initial []');

  k.hobbies = ['jogging', 'tennes'];
  assert(Array.isArray(k.hobbies));
  assert(k.hobbies.length === 2);

  k.hobbies = null;
  assert(Array.isArray(k.hobbies));
  assert(k.hobbies.length === 0);

  k.hobbies = void 0;
  assert(Array.isArray(k.hobbies));
  assert(k.hobbies.length === 0);

  var hob = k.hobbies;
  hob.push('surfing');
  assert(hob.length === 1);
  assert(k.hobbies.length === 0);

  k.hobbies = [1, 2, 3];
  k.hobbies = ['jogging', 'tennes', null];
  k.hobbies = [null];

  assert.throws(function (){
    k.hobbies = 'jogging';
  });

})();


// Array以外の時にitemを指定
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.hobbies = {
    type: String,
    item: String
  };

  var k;

  assert.throws(function(){
    k = new Klass();
  });

})();

