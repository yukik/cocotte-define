'use strict';
var def = require('../define');
var assert = require('assert');

var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = def.Date;


var k = new Klass();

k.birthday = new Date(1990, 10, 9);
assert(k.birthday instanceof Date);
assert(k.birthday.getTime() === new Date(1990, 10, 9).getTime());

k.birthday = '1990-11-9';
assert(k.birthday instanceof Date);
assert(k.birthday.getTime() === new Date(1990, 10, 9).getTime());

assert.throws(function () {
  k.birthday = 'today';
});


