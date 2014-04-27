'use strict';
var def = require('../define');
var assert = require('assert');

// 型確認ありメソッド
(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.name = {type: String};
  Klass.methods.setName = function (pv) {
    return {
      params: [String],
      method: function (val) {
        pv.name = val;
      }
    };
  };
  var k = new Klass();
  k.setName('foo');
  assert(k.name === 'foo');

  assert.throws(function(){
    k.setName(123);
  });

  k.setName(null);
  assert(k.name === null);

  k.setName(void 0);
  assert(k.name === void 0);

  assert.throws(function(){
    k.setName();
  });

  assert.throws(function(){
    k.setName('bar', 'baz');
  });

})();