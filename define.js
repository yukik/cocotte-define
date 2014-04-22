'use strict';

/**
 * dependencies
 */
var util = require('util');

/**
 * (exports)
 * 定義メソッド
 * @method cocotteDefine
 * @param  {Function}      Klass
 * @param  {Function}      SuperKlass　継承元　（省略可能）
 */
var cocotteDefine = function cocotteDefine(Klass, SuperKlass) {
  if (SuperKlass) {
    util.inherits(Klass, SuperKlass);
  }
  Klass.prototype.def = protoDef;
  Klass.properties = {};
  Klass.methods = {};
};

/**
 * 初期化メソッド
 * @method protoDef
 * @param  {Function} Klass
 */
var protoDef = function protoDef (Klass) {

  // 初回に一時変数を設定
  var first = tempSet(this);

  // 親クラスのコンストラクタの呼び出し
  var args = [].slice.call(arguments);
  args.shift();
  var SuperKlass = Klass.super_;
  if (SuperKlass) {
    if (args.length) {
      SuperKlass.apply(this, args);
    } else {
      SuperKlass.call(this);
    }
  }

  // プロパティの設定
  defineProperties(this, Klass.properties);

  // メソッドの設定
  defineMethods(this, Klass.methods);
  
  // 初回定義の後始末
  if (first) {
    defineValueProperty(this);
    tempDel(this);
    // cocotte-defineで定義されたオブジェクトであるフラグを建てる
    Object.defineProperty(this, 'cocotteDefine_', {value: true, writable: false});
    // 初期化関数が再度動作しないように設定される
    Object.defineProperty(this, 'def', {value: nothingToDo, writable: false});
  }
};

/**
 * 初期化関数が再度動作しないように設定される
 * @method nothingToDo
 */
var nothingToDo = function () {};

/**
 * 一時変数の設定
 */
var tempSet = function tempSet(instance) {

  if (instance.def_) {
    return false;
  }

  instance.def_ = {
    pv: {},         // プライベート変数
    gettable: [],   // 読取可能なプロパティ（親クラスも含む）
    properties: [], // プロパティ一覧（親クラスも含む）
    methods: []     // メソッド一覧（親クラスも含む）
  };

  return true;
};

/**
 * 一時変数の削除
 */
var tempDel = function tempDel (instance) {
  delete instance.def_;
};

/**
 * プロパティ定義
 * @method defineProperties
 * @param  {Object} instance   インスタンス
 * @param  {Object} properties Getter/Setterを定義したプロパティ
 */
var defineProperties = function defineProperties(instance, properties) {
  var pv = instance.def_.pv;
  var gettable = instance.def_.gettable;
  Object.keys(properties).forEach(function(p) {
    var def = properties[p];

    // 同名の定義済みのプロパティが存在する場合は上書きする
    if (~instance.def_.properties.indexOf(p)) {
      gettable = gettable.filter(function(v) {return v !== p;});
      instance.def_.properties = instance.def_.properties.filter(function(v) {return v !== p;});
    }

    // 同名の定義済みのメソッドが存在する場合は例外
    if (~instance.def_.methods.indexOf(p)) {
      throw new Error(p + 'は既にメソッドとして定義されているため、プロパティに設定できません');
    }

    if (typeof def === 'function') {
      // 対象が定義用の関数の場合はgetter,setterを個別に設定
      var n = def(pv);
      if (!n.setter && !n.getter) {
        throw new Error('setterもしくはgetterのいずれかを設定してください');
      }
      Object.defineProperty (instance, p, {
        enumerable: true,
        set: n.setter || setError,
        get: n.getter || getError
      });
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
      gettable.push(p);
    }

    instance.def_.properties.push(p);

  });
};

/**
 * 汎用セッタ
 */
var setter = function setter (propName, type, pv) {
  return function commonSetter (val) {
    if (val === null || val === void 0) {
      pv[propName] = null;

    } else if (typeof val === 'string' && type === String) {
      pv[propName] = val;

    } else if (typeof val === 'number' && type === Number) {
      pv[propName] = val;

    } else if (typeof val === 'boolean' && type === Boolean) {
      pv[propName] = val;

    } else if (val instanceof type) {
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
 */
var getter = function getter (propName, pv) {
  return function commonGetter () {
    return propName in pv ? pv[propName] : null;
  };
};

/**
 * 読取専用プロパティ用setter
 */
var setError = function setterError() {
  throw new Error('値を設定する事ができません');
};

/**
 * 書込専用プロパティ用getter
 */
var getError = function setterError() {
  throw new Error('値を取得する事ができません');
};

/*
 * 一覧を取得するプロパティvalueのgetter
 */
var defineValueProperty = function defineValueProperty (instance) {

  var gettable = instance.def_.gettable;
  var properties = instance.def_.properties;
  var methods = instance.def_.methods;

  // 自己循環対策
  var ref  = null;

  Object.defineProperty(instance, 'value', {
    enumerable: true,
    get: function value () {

      var root = !ref;
      if (root) {
        ref = [];
      }
      var v = {};

      try {
        // インスタンスに直接設定したプロパティの値を取得
        for(var p in instance) {
          if (
            // 読取可能プロパティ
            ~gettable.indexOf(p) ||
            // cocotteでは定義されていないプロパティ
            p !== 'value' && p !== 'def' && instance.hasOwnProperty(p) &&
            !~properties.indexOf(p) && !~methods.indexOf(p)) {

            var item = instance[p];

            // プロパティの値が更にcocotteDefineで設定されて
            // いる場合は、valueの値を返す
            if (item && typeof item === 'object') {
              if (~ref.indexOf(item)) {
                // 自己参照はvalueにアクセスしない
                v[p] = item;
              } else {
                ref.push(item);
                v[p] = item.cocotteDefine_ ? item.value : item;
              }

            } else {
              v[p] = item;

            }
          }
        }
      } catch (e) {
        ref = null;
        throw e;
      }

      if (root) {
        ref = null;
      }
      return v;
    },
    set: function () {
      throw new Error('valueには値を設定できません');
    }
  });
};

/**
 * メソッド定義
 * @param  {Object} instance インスタンス
 * @param  {Object} meths    メソッド
 */
var defineMethods = function defineMethods (instance, methods) {

  var pv = instance.def_.pv;

  Object.keys(methods).forEach(function(m) {

    if (~instance.def_.properties.indexOf(m)) {
      throw new Error(m + 'は既にプロパティとして定義されているため、メソッドに設定できません');
    }

    var def = methods[m](pv);

    if (typeof def === 'function') {
      // 型チェック無し
      instance[m] = def;

    } else if (typeof def === 'object'){
      // 型チェックあり
      instance[m] = method(m, def);
    }
    
    if (!~instance.def_.methods.indexOf(m)) {
      instance.def_.methods.push(m);
    }
  });
};

/**
 * 引数チェックを含んだメソッド
 * @method method
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

  return function paramCheckMethod() {
    var p = [];

    // 引数チェック
    for(var i = 0, len = arguments.length; i < len; i++) {
      var type = params[i];
      var v = arguments[i];

      if (!type) {
        throw new TypeError('引数' + i + 'は設定してはいけません');
      }
      // null,undefinedは型のチェックをしない
      if (v === null || v === void 0) {
        p.push(v);

      } else if (typeof v === 'string' && type === String) {
        p.push(v);

      } else if (typeof v === 'number' && type === Number) {
        p.push(v);

      } else if (typeof v === 'boolean' && type === Boolean) {
        p.push(v);

      } else if (v instanceof type) {
        p.push(v);

      } else {
        // 型の不一致が発生
        var name = type.name;
        var msg = name ? methodName + 'の引数' + i + 'は' + name + 'である必要があります' :
            methodName + 'の引数' + i + 'に不正な値が設定されました';
        throw new TypeError(msg);
      }
    }
    // メソッドの実行
    return md.apply(this, p);
  };
};

module.exports = exports = cocotteDefine;