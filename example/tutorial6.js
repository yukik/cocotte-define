'use strict';

var def = require('../define');

/**
 * prototypeとの併用
 *
 * プライベート変数を使用しないプロパティやメンバーは通常通りに
 * コンストラクタの中やprototypeで定義する事が出来ます
 *
 * prototypeを使用する事で、使用メモリの削減が出来ますので
 * methodsに定義する前にprototypeで可能かを検討してください
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
SuperKlass.prototype.setProp4 = function setProp4 (val) {
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

k.prop2 = 'baz';
k.setProp3('qux');
k.setProp4('hoge');
k.prop6 = 'piyo';
k.setProp7('fuga');
k.setProp8('hogera');

// prop3とprop7はプライベート変数の為に外部から取得できない
console.log(k.value);

