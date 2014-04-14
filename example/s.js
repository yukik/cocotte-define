'use strict';

var def = require('../define');

var SuperKlass = function SuperKlass (config, pv) {
	def (this, superProps, null, config, pv);
};
var superProps = {};
superProps.prop1 = {type: String};


var Klass = function Klass (config) {
	def (this, props, null, config, null, SuperKlass);
};
var props = {};
props.prop2 = {type: String};

var k = new Klass({prop1: 'foo'});
console.log(k.prop1); // 'foo'