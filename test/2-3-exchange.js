'use strict';
var def = require('../define');
var assert = require('assert');

(function () {
  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.properties.name = function (pv) {
    return {
      getter: function () {
        return pv.name;
      },
      exchange: {
        from: String,
        to: function (val) {
          return 'A' + val;
        }
      },
      setter: function (val) {
        pv.name = val;
      }
    };
  };

  var k = new Klass();

  k.name = 'foo';
  assert(k.name === 'Afoo');

  k.name = 123;
  assert(k.name === 123);

  k.name = null;
  assert(k.name === null);

  k.name = void 0;
  assert(k.name === null);

})();

