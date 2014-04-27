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