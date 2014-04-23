'use strict';

var def = require('cocotte-define');

/**
 * prototypeとの併用
 */

// ------------- スーパークラス定義
var SuperKlass = function SuperKlass(prop1) {
  this.def(SuperKlass);
  this.prop1 = prop1;
};
def(SuperKlass);
SuperKlass.properties.prop2 = {type: String};
SuperKlass.methods.setProp3 = function (pv) {
  return function (val) {
    pv.prop3 = val;
  };
};
SuperKlass.prototype.setProp4 = function setProp2 (val) {
  this.prop4 = val;
};

// ------------- サブクラス定義
var Klass = function Klass(prop1, prop5) {
  this.def(Klass, prop1);
  this.prop5 = prop5;
};
def(Klass, SuperKlass);
Klass.properties.prop6 = {type: String};
Klass.methods.setProp7 = function (pv) {
  return function (val) {
    pv.prop7 = val;
  };
};
Klass.prototype.setProp8 = function setProp8 (val) {
  this.prop8 = val;
};

// ------------- ユーザーコード
var k = new Klass('foo', 'bar');
console.log(k.value); // スーパークラスのdefine使用のプロパティはvalueで取得可能
console.log(k.prop1); // スーパークラスの手動プロパティはvalueではなく直接取得

