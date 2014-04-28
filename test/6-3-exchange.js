'use strict';
var def = require('../define');
var assert = require('assert');

(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('birthday', {
    exchange: {
      from: String,
      to: function (val) {
        return new Date(val);
      }
    },
    type: Date,
    setter: function (val) {
      this.birthday_ = val;
    },
    getter: function () {
      return this.birthday_;
    }
  });

  var k = new Klass();

  k.birthday = '1990-2-18';

  assert.deepEqual(k.birthday, new Date('1990-2-18'));

  assert.throws(function(){
    k.birthday = 635266800000;
  });

})();


(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('birthday', {
    exchange: [
      {
        from: String,
        to: function (val) {
          return new Date(val);
        }
      },
      {
        from: Number,
        to: function (val) {
          return new Date(val);
        }
      }
    ],
    type: Date,
    setter: function (val) {
      this.birthday_ = val;
    },
    getter: function () {
      return this.birthday_;
    }
  });

  var k = new Klass();

  k.birthday = '1990-2-18';
  assert.deepEqual(k.birthday, new Date('1990-2-18'));

  k.birthday = 635266800000;
  assert.deepEqual(k.birthday, new Date(635266800000));

  assert.throws(function(){
    k.birthday = true;
  });

})();

// Array item
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    exchange: {
      from: Array,
      item: String,
      to: function (val) {
        return val.join();
      }
    },
    type: String,
    setter: function (val) {
      this.prop1_ = val;
    },
    getter: function () {
      return this.prop1_;
    }
  });

  var k = new Klass();

  k.prop1 = 'foo';
  assert(k.prop1 === 'foo');

  k.prop1 = ['foo', 'bar', 'baz'];
  assert(k.prop1 === 'foo,bar,baz');

  k.prop1 = [];
  assert(k.prop1 === '');

  assert.throws(function(){
    k.prop1 = [1, 2, 3];
  });

  assert.throws(function(){
    k.prop1 = ['foo', 1];
  });

})();