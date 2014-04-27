'use strict';
var def = require('../define');
var assert = require('assert');

// 1 exchange
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    exchange: {
      from: Number,
      to: function (val) {
        return 'A' + val;
      }
    },
    type: String
  });
  var k = new Klass();

  var ps = [];
  for(var p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['value']);

  var proto = Object.getPrototypeOf(k);

  ps = [];
  for(p in proto) {
    if (proto.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['def', 'prop1']);

  assert(k.prop1 === null);

  k.prop1 = 'foo';
  assert(k.prop1 === 'foo');

  assert.deepEqual(k.value, {prop1_: 'foo'});

  k.prop1 = 123;
  assert(k.prop1 === 'A123');

  assert.throws(function (){
    k.prop1 = new Date();
  });

})();



// 3 exchange
(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {
    exchange: [
      {
        from: Date,
        to: function (val) {
          return 'A' + val.getTime();
        }
      },
      {
        from: Number,
        to: function (val) {
          return 'B' + val;
        }
      },
      {
        from: String,
        to: function (val) {
          return 'C' + val;
        }
      }
    ],
    type: String
  });
  var k = new Klass();

  var ps = [];
  for(var p in k) {
    if (k.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['value']);

  var proto = Object.getPrototypeOf(k);

  ps = [];
  for(p in proto) {
    if (proto.hasOwnProperty(p)) {
      ps.push(p);
    }
  }
  assert.deepEqual(ps, ['def', 'prop1']);

  assert(k.prop1 === null);

  k.prop1 = 'foo';
  assert(k.prop1 === 'Cfoo');

  assert.deepEqual(k.value, {prop1_: 'Cfoo'});

  k.prop1 = 123;
  assert(k.prop1 === 'B123');

  k.prop1 = new Date('2014-1-1');
  assert(k.prop1 === 'A' + (new Date('2014-1-1')).getTime());

})();
