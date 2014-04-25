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
  // プロトタイプに設定するプロパティとメソッド
  Klass.setProperty = setProperty;
  Klass.setMethod = setMethod;
};

/**
 * プロトタイプに直接メソッドを追加する
 * @method setProperty
 * @param  {String} name
 * @param  {Object} config
 */
var setProperty = function setProperty(name, config) {
  if (typeof name !== 'string' || typeof config !== 'object' || config === null) {
    throw new TypeError('引数エラー');
  }

  var type = config.type; // 入力値の型
  var exchange = config.exchange; // 型変換
  var setter = config.setter;
  var getter = config.getter;
  var readonly = !setter && !!getter;
  var writeonly = !!setter && !getter;

  if (!type && !(setter || getter)) {
    throw new TypeError('typeとsetter/getterのどちらか設定してください');
  }

  if (readonly && (exchange || type)) {
    throw new Error('読取専用のプロパティにexchangeやtypeは設定できません');
  }

  if (!setter) {
    setter = readonly ? setError : true;
  }

  setter = buildSetter(name, setter, type, exchange);

  if (!getter) {
    getter = writeonly ? getError : getterForPrototype(name);
  }

  Object.defineProperty (this.prototype, name, {
    enumerable: true,
    set: setter,
    get: getter
  });
};

/**
 * プロトタイプメソッドの追加
 * @method setMethod
 * @param  {String}  name
 * @param  {Object}  config
 */
var setMethod = function setMethod (name, config) {
  if (typeof name !== 'string' || typeof config !== 'object' || config === null) {
    throw new TypeError('引数エラー');
  }

  if (!Array.isArray(config.params) || typeof config.method !== 'function') {
    throw new Error('paramsとmethodの定義が不正です');
  }

  var methods = [];

  if (this.prototype.hasOwnProperty(name)) {
    if (typeof this.prototype[name] !== 'function') {
      throw new Error(name + 'は既にメソッドではない定義がされています');
    }

    methods = this.prototype[name].methods;

    if (!methods) {
      throw new Error(name + 'は既にsetMethod以外で定義されたメソッドが設定されています');
    }
  }

  methods.push(config);

  this.prototype[name] = methodArgCheck(name, methods);
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

  // 初回にvalueプロパティの追加と一時変数の削除
  if (first) {
    defineValueProperty(this);
    tempDel(this);
    // cocotte-defineで定義されたオブジェクトであるフラグを建てる
    Object.defineProperty(this, 'cocotteDefine_',
      {get: cocotteDefine_getter});
  }
};

var cocotteDefine_getter = function () {return true;};

/**
 * 一時変数の設定
 * @method tempSet
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

// 一時変数の削除
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
      gettable = instance.def_.gettable = gettable.filter(function(v) {return v !== p;});
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
        set: buildSetter(p, n.setter, n.type, n.exchange, pv),
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

      if (def.getter || def.setter) {
        throw new Error('propertiesにオブジェクトを設定する場合は、getter/setterを設定できません。setPropertyを使用してください');
      }

      Object.defineProperty (instance, p, {
        enumerable: true,
        set: buildSetter(p, true, def.type, def.exchange, pv),
        get: getterWithPrivate(p, pv)
      });
      gettable.push(p);
    }

    instance.def_.properties.push(p);

  });
};

var buildSetter = function buildSetter(propName, setter, type, exchange, pv) {

  // セッター無し
  if (!setter) {
    return setError;
  }

  // 型チェック無し
  if (!type && !exchange) {
    return setter;
  }

  exchange = !exchange || Array.isArray(exchange) ? exchange : [exchange];

  /**
   * 型チェック有り
   */
  return function (val) {

    if (val === void 0) {
      val = null;
    }

    if (val !== null && exchange) {

      exchange.some(function (p) {
        var tp = p.from;
        if (tp === String && typeof val === 'string' ||
            tp === Number && typeof val === 'number' ||
            tp === Boolean && typeof val === 'boolean' ||
            val instanceof tp) {

          val = p.to(val);
          return true;

        } else {
          return false;
        }
      });
    }

    if (val === null ||
        !type ||
        type === String && typeof val === 'string' ||
        type === Number && typeof val === 'number' ||
        type === Boolean && typeof val === 'boolean' ||
        val instanceof type) {

      if (setter === true) {
        if (pv) {
          pv[propName] = val;
        } else {
          this[propName + '_'] = val;
        }

      } else {
        setter.call(this, val);

      }
    } else {
      var typeName = type.name;
      var msg = typeName ? propName + 'は' + typeName + 'である必要があります' :
            propName + 'に不正な値が設定されました';
      throw new TypeError(msg);
    }
  };
};

/**
 * プロトタイプ用汎用ゲッタ
 * @method getterForPrototype
 * @param  {String} propName
 * @return {Mixed}  値
 */
var getterForPrototype = function getterForPrototype (propName) {
  return function getter () {
    var name = propName + '_';
    return name in this ? this[name] : null;
  };
};

/**
 * プライベート変数あり汎用ゲッタ
 * @method getterWithPrivate
 * @param  {String} propName
 * @param  {Object} pv
 * @return {Mixed}  値
 */
var getterWithPrivate = function getterWithPrivate (propName, pv) {
  return function getter () {
    return propName in pv ? pv[propName] : null;
  };
};

/**
 * 読取専用プロパティ用setter
 */
var setError = function setError() {
  throw new Error('値を設定する事ができません');
};

/**
 * 書込専用プロパティ用getter
 */
var getError = function getError() {
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
            instance.hasOwnProperty(p) && p !== 'value' &&
            !~properties.indexOf(p) && !~methods.indexOf(p)) {

            var item = instance[p];

            // プロパティの値が更にcocotteDefineで設定されて
            // いる場合は、valueの値を返す
            if (item && typeof item === 'object') {
              if (~ref.indexOf(item)) {
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
 * インスタンスメソッド定義
 * @param  {Object} instance インスタンス
 * @param  {Object} meths    メソッド
 * @param  {Object} pv       プライベート変数
 */
var defineMethods = function defineMethods (instance, methods) {

  var pv = instance.def_.pv;

  Object.keys(methods).forEach(function(m) {

    if (~instance.def_.properties.indexOf(m)) {
      var msg = m + 'は既にプロパティとして定義されているため、メソッドに設定できません';
      throw new Error(msg);
    }

    var def = methods[m](pv);

    if (typeof def === 'function') {
      // 型チェック無し
      instance[m] = def;

    } else if (Array.isArray(def)) {
      // 型チェックありオーバーロードあり
      instance[m] = methodArgCheck(m, def);

    } else if (typeof def === 'object'){
      // 型チェックあり
      instance[m] = methodArgCheck(m, [def]);

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
var methodArgCheck = function methodArgCheck (methodName, def) {

  var method = function paramCheckMethod() {
    var self = this;
    var values = [].slice.apply(arguments);
    var result;

    var run = def.some(function(m) {
      var params = m.params;
      var len = values.length;

      if (params.length !== len) {
        return false;
      }

      // 引数チェック
      for(var i = 0; i < len; i++) {
        var type = params[i];
        var v = values[i];

        if (!type) {
          return false;
        }
        if (v === null || v === void 0 ||
            typeof v === 'string' && type === String ||
            typeof v === 'number' && type === Number ||
            typeof v === 'boolean' && type === Boolean ||
            v instanceof type) {
        } else {
          return false;
        }
      }
      result = m.method.apply(self, values);
      return true;
    });

    if (!run) {
      var msg = methodName + 'は引数が不正のため実行できません';
      throw new TypeError(msg);
    }
    return result;
  };

  method.methods = def;

  return method;
};

/**
 * 型変換を行うDate
 */
cocotteDefine.Date = {
  type: Date,
  exchange: [{
    from: String,
    to: function (val) {
      var d = new Date(val);
      return Number.isNaN(d.getTime()) ? val : d;
    }
  }]
};

module.exports = exports = cocotteDefine;