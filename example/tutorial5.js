'use strict';


/**
 * 継承パターン
 */

var def = require('cocotte-define');
// ------------- クラス定義

var SuperKlass = function SuperKlass(config, pv) {
	// プロパティ定義を行う
	def(this, superProps, superMeths, config, pv);
};

var superProps = {};

superProps.prop1 = {type: String};

// メソッド定義
var superMeths = {};

// プロパティ定義の例
superMeths.setProp1 = function (pv) {
	return {
		params: [String],
		method: function (val) {
			pv.prop1 = val;
		}
	};
};

// ------------- クラス定義

var Klass = function Klass(config, pv) {
	// プロパティ定義を行う
	def(this, props, meths, config, pv, SuperKlass);
};

var props = {};

props.prop2 = {type: String};

// メソッド定義
var meths = {};

// プロパティ定義の例
meths.setProp2 = function (pv) {
	return {
		params: [String],
		method: function (val) {
			pv.prop2 = val;
		}
	};
};

Klass.prototype.getName = function () {
	return this.name1 + this.name;
};

meths.getPv = function (pv) {
	return function () {
		return pv;
	};
};

// ------------- ユーザーコード

var k = new Klass({name1: 'yuki'});
k.setName('foo');
console.log(k.getName());
console.log(k.value);

var k2 = new Klass({name1: 'miki'});
k2.setName('baz');
console.log(k2.value);



