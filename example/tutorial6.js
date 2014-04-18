'use strict';

var def = require('cocotte-define');

/**
 * prototypeとの併用
 */

// ------------- スーパークラス定義

var SuperKlass = function SuperKlass(config, pv) {
  def(this, superProps, superMeths, config, pv);
  this.prop1 = 1;
};

var superProps = {};
superProps.prop2 = {type: String};

var superMeths = {};
superMeths.setProp3 = function (pv) {
  return function (val) {
    pv.prop3 = val;
  };
};

SuperKlass.prototype.setProp4 = function setProp2 (val) {
  this.prop4 = val;
};

// ------------- サブクラス定義
var Klass = function Klass(config, pv) {
  def(this, props, meths, config, pv, SuperKlass);
  this.prop5 = 2;
};

var props = {};
props.prop6 = {type: String};

var meths = {};
meths.setProp7 = function (pv) {
  return function (val) {
    pv.prop7 = val;
  };
};

Klass.prototype.setProp8 = function setProp8 (val) {
  this.prop8 = val;
};

// ------------- ユーザーコード
var k = new Klass();
console.log(k.value); // スーパークラスのdefine使用のプロパティはvalueで取得可能
console.log(k.prop1); // スーパークラスの手動プロパティはvalueではなく直接取得





