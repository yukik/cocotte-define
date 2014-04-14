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

// ------------- ユーザーコード

var k = new Klass({prop2: 'foo'});
k.setProp1('bar');
console.log(k.value);

var k2 = new Klass({prop1: 'baz'});
k2.setProp2('qux');
console.log(k2.value);



