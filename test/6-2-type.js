'use strict';
var def = require('../define');
var assert = require('assert');


(function() {

  var Klass = function Klass() {
    this.def(Klass);
  };
  def(Klass);
  Klass.setProperty('birthday', {
    type: Date,
    setter: function (val) {
      this.birthday_ = val;
    },
    getter: function () {
      return this.birthday_;
    }
  });

  var k = new Klass();

  assert(k.birthday === void 0);

  k.birthday = new Date('1990-4-13');

  assert.deepEqual(k.birthday, new Date('1990-4-13'));

  k.birthday = null;
  assert(k.birthday === null);

  k.birthday = void 0;
  assert(k.birthday === null);

  assert.throws(function(){
    k.birthday = '1990-3-4';
  });

})();