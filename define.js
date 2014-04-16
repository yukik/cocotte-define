/*jshint maxparams:6*/

'use strict';

/**
 * プロパティ定義
 * @method defineProperties
 * @param  {Object} instance インスタンス
 * @param  {Object} props    Getter/Setterを定義したプロパティ
 * @param  {Object} pv       プライベート変数
 * @param  {Array}  
 */
var defineProperties = function defineProperties(instance, props, pv) {
	var gettable = [];
	Object.keys(props).forEach(function(p) {
		var def = props[p];

		if (typeof def === 'function') {
			// 対象が定義用の関数の場合はgetter,setterを個別に設定
			var n = def(pv);
			if (!n.setter && !n.getter) {
				throw new Error('setterもしくはgetterのいずれかを設定してください');
			}
			Object.defineProperty (instance, p, {
				enumerable: true,
				set: n.setter,
				get: n.getter
			});
			// 既定値の設定
			if ('value' in n) {
				instance[p] = n.value;
			}
			if (n.getter) {
				gettable.push(p);
			}

		} else if (typeof def === 'object') {
			// オブジェクトの場合は型の指定と見なして汎用設定
			var type = def.type;
			if (!type) {
				throw new Error('型の指定が存在しません');
			}
			Object.defineProperty (instance, p, {
				enumerable: true,
				set: setter(p, type, pv),
				get: getter(p, pv)
			});
			// 既定値の設定
			if ('value' in def) {
				instance[p] = def.value;
			}
			gettable.push(p);
		}

	});
	return gettable;
};


/**
 * 汎用セッタ
 * @method setter
 * @param  {String} propName
 * @param  {Object} def
 * @param  {Object} pv
 */
var setter = function setter (propName, type, pv) {
	return function (val) {
		if (val === null || val === void 0) {
			// nullまたはundefinedはnullに設定する
			pv[propName] = null;
		} else if (val.constructor === type) {
			// 型が一致する場合にのみ設定できる
			pv[propName] = val;
		} else {
			var name = type.name;
			var msg = name ? propName + 'は' + name + 'である必要があります' :
						propName + 'に不正な値が設定されました';
			throw new TypeError(msg);
		}
	};
};

/**
 * 汎用ゲッタ
 * @method getter
 * @param  {String} propName
 * @return {Mixed}  値
 */
var getter = function getter (propName, pv) {
	return function () {
		return propName in pv ? pv[propName] : null;
	};
};

/**
 * メソッド定義
 * @param  {Object} instance インスタンス
 * @param  {Object} meths    メソッド
 * @param  {Object} pv       プライベート変数
 */
var defineMethods = function defineMethods(instance, meths, pv) {
	Object.keys(meths).forEach(function(m) {
		var def = meths[m](pv);

		if (typeof def === 'function') {
			// 型チェック無し
			instance[m] = def;

		} else if (typeof def === 'object'){
			// 型チェックあり
			instance[m] = method(m, def);
		}
		
	});
};

/**
 * 引数チェックを含んだメソッド
 * @method method
 * @param  {Object} instance
 * @param  {String} methodName
 * @param  {Object} def
 */
var method = function method (methodName, def) {
	var params = def.params;
	var md = def.method;

	if (!(params instanceof Array)) {
		throw new TypeError('paramsが設定されていません');
	}

	if (typeof md !== 'function') {
		throw new TypeError('methodが設定されていません');
	}

	return function () {
		var p = [];

		// 引数チェック
		for(var i = 0, len = arguments.length; i < len; i++) {
			var type = params[i];
			var v = arguments[i];

			if (!type) {
				throw new TypeError('引数' + i + 'は設定してはいけません');
			}
			// null,undefinedは型のチェックをしない
			if (v === null || v === void 0 || v.constructor === type) {
				p.push(v);

			// 型の不一致が発生
			} else {
				var name = type.name;
				var msg = name ? methodName + 'の引数' + i + 'は' + name + 'である必要があります' :
						methodName + 'の引数' + i + 'に不正な値が設定されました';
				throw new TypeError(msg);
			}
		}
		// メソッドの実行
		md.apply(this, p);
	};
};

/**
 * クラス定義
 * コンストラクタ内で呼び出し
 * @param  {Object} instance インスタンス
 * @param  {Object} props    プロパティ定義
 * @param  {Object} meths    メソッド定義
 */
var cocotteDefine = function cocotteDefine (instance, props, meths, config, pv, SuperClass) {

	// new チェック
	if (instance === global || instance === undefined) {
		throw new Error('newを付加しないでコンストラクタを実行してはいけません');
	}

	// 初期値
	config = config || {};

	// プライベート変数
	pv = pv || {};

	// 継承
	if (SuperClass) {
		instance.__proto__.__proto__ = new SuperClass(config, pv);
	}

	if (!pv.value) {
		pv.value = [];
	}

	// 取得可能プロパティ
	var gettable = [].concat(pv.value);

	// プロパティの設定
	if (props) {
		var g = defineProperties(instance, props, pv);
		g.forEach(function(p){
			if (!~gettable.indexOf(p)) {
				pv.value.push(p);
				gettable.push(p);
			}
		});

		// 値の設定
		Object.keys(config).forEach(function(k){
			if (props[k]) {
				instance[k] = config[k];
			}
		});
	}

	if (meths) {
		defineMethods(instance, meths, pv);
	}


	// instance.valueでプロパティのすべての値を取得
	Object.defineProperty (instance, 'value', {
		enumerable: true,
		get: valueGetter(instance, gettable)
	});

	return cocotteDefine;
};


var valueGetter = function (instance, gettable) {
	return function () {
		var v = {};
		gettable.forEach(function(p){
			v[p] = instance[p];
		});
		return v;
	};
};

module.exports = exports = cocotteDefine;