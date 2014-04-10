'use strict';

var def = require('../define');

var assert = require('assert');

var props = {};
var meths = {};


var Klass = function Klass (config) {
	def(this, props, meths);

	this.str1 = config.str1;
	this.num1 = config.num1;
};

props.str1 = {type: String, value: 'def'};

props.str2 = function (pv) {
	return {
		value: 'hoge',
		getter: function () {
			return pv.str2;
		},
		setter: function (val) {
			if (val === null || val === void 0 || val.constructor === String) {
				pv.str2 = val;
			} else {
				throw new TypeError('引数が文字列ではありません');
			}
		}
	};
};

props.num1 = {type: Number, value: 100};

props.num2 = function (pv) {
	return {
		getter: function () {
			return pv.num2;
		},
		setter: function (val) {
			if (1 <= val && val <= 100) {
				pv.num2 = val;
			} else {
				throw new TypeError('1から100までの数字を設定してください');
			}
		}
	};
};


meths.m1 = function (pv) {
	return function (val) {
		this.num1 = pv.num1 ? pv.num1 + val : val;
	};
};

meths.m2 = function (pv) {
	return {
		params: [Number],
		method: function (val) {
			this.num2 = pv.num2 ? pv.num2 + val : val;
		}
	};
};


var config = {str1: 'foo', num1: 10};
var k = new Klass(config);

// --- test

assert(k.str1 === 'foo');

k.str1 = 'bar';

assert(k.str1 === 'bar');

var err = null;
try {
	k.str1 = 123;
} catch (e) {
	err = e;
}

assert(err);

assert(k.str2 === 'hoge');

k.str2 = 'piyo';

assert(k.str2 === 'piyo');

err = null;
try {
	k.str2 = 123;
} catch (e) {
	err = e;
}
assert(err);


// TODO 続きは後日

console.log('test success');









