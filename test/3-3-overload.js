'use strict';
var def = require('../define');
var assert = require('assert');


(function () {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.name = {type: String};
  Klass.methods.setName = function (pv) {
    return [
      {
        params: [String],
        method: function (val) {
          pv.name = val;
        }
      },
      {
        params: [Number],
        method: function (val) {
          this.setName('A' + val);
        }
      }
    ];
  };

  var k = new Klass();

  assert(k.name === null);

  k.setName('foo');
  assert(k.name === 'foo');

  k.setName(123);
  assert(k.name  === 'A123');

  k.setName(null);
  assert(k.name === null);

  k.setName(void 0);
  assert(k.name === void 0);

  assert.throws(function(){
    k.setName();
  });

  assert.throws(function(){
    k.setName('foo', 'bar');
  });

})();