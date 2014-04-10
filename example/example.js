'use strict';

var def = require('../define');

var props = {};
var meths = {};

var Klass = function Klass() {
	def(this, props, meths);
};

props.name = function (pv) {
	return {
		setter: function (val) {
			pv.name = val;
		},
		getter: function () {
			return pv.name;
		}
	};
};

props.age = function (pv) {
	return {
		setter: function (val) {
			pv.age = val;
		},
		getter: function () {
			return pv.age;
		}
	};
};

props.plus = function (pv) {
	return {
		setter: function (val) {
			pv.age += val;
		}
	};
};


props.nameLength = function(pv){
	return {
		getter: function() {
			return pv.name.length;
		}
	};
};

meths.addAge = function (pv) {
	return function (val) {
		pv.age += val;
	};
};


var k = new Klass();

k.name = 'foo';

k.age = 10;

k.addAge(5);

k.plus = 3;

console.log(k.value);


