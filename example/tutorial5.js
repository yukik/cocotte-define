'use strict';
var def = require('cocotte-define');

/**
 * 継承パターン
 *
 * 継承を行う場合は、定義関数でdef(クラス, スーパークラス)とします
 *
 * スーパークラスのコンストラクタはコンストラクタの
 * 初期化関数のthis.def(クラス, スーパークラスへの引数1, 引数2,...)とします
 */

// ------------- スーパースーパークラス定義
var SuperSuperKlass = function SuperSuperKlass(prop1) {
  this.def(SuperSuperKlass);
  this.prop1 = prop1;
};
def(SuperSuperKlass);
SuperSuperKlass.properties.prop1 = {type: String};
SuperSuperKlass.methods.setProp1 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop1 = val;
    }
  };
};

// ------------- スーパークラス定義
var SuperKlass = function SuperKlass(prop1, prop2) {
  this.def(SuperKlass, prop1);
  this.prop2 = prop2;
};
def(SuperKlass, SuperSuperKlass);
SuperKlass.properties.prop2 = {type: String};
SuperKlass.methods.setProp2 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop1 = val;
    }
  };
};

// ------------- サブクラス定義
var Klass = function Klass(prop1, prop2, prop3) {
  this.def(Klass, prop1, prop2);
  this.prop3 = prop3;
};
def(Klass, SuperKlass);
Klass.properties.prop3 = {type: String};
Klass.methods.setProp3 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop3 = val;
    }
  };
};

// ------------- ユーザーコード
var k = new Klass('foo', 'bar', 'baz');

console.log(k.value);




