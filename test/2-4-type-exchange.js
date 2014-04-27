'use strict';
var def = require('../define');
var assert = require('assert');

// 1 exchange 
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
        from: Number,
        to: function (val) {
          return 'A' + val;
        }
      },
      type: String,
      setter: function (val) {
        pv.name = val;
      }
    };
  };

  var k = new Klass();

  k.name = 'foo';
  assert(k.name === 'foo');

  k.name = 123;
  assert(k.name === 'A123');

  k.name = null;
  assert(k.name === null);

  k.name = void 0;
  assert(k.name === null);

  assert.throws(function(){
    k.name = new Date();
  });

})();


// 3 exchange
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
      exchange: [
        {
          from: Number,
          to: function (val) {
            return 'A' + val;
          }
        },
        {
          from: Date,
          to: function (val) {
            return 'B' + val.getTime();
          }
        },
        {
          from: String,
          to: function (val) {
            return 'C' + val;
          }
        }
      ],
      type: String,
      setter: function (val) {
        pv.name = val;
      }
    };
  };

  var k = new Klass();

  k.name = 'foo';
  assert(k.name === 'Cfoo');

  k.name = 123;
  assert(k.name === 'A123');

  k.name = null;
  assert(k.name === null);

  k.name = void 0;
  assert(k.name === null);

  k.name = new Date('1990-9-9');
  assert(k.name === 'B' + (new Date('1990-9-9')).getTime());
  

})();
