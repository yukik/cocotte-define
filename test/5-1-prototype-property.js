'use strict';
var def = require('../define');
var assert = require('assert');

(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('prop1', {type: String});
  var k = new Klass();

  assert(!('prop1_' in k));
  assert(k.prop1 === null);

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

})();
