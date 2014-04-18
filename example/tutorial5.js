'use strict';
var def = require('cocotte-define');

/**
 * 継承パターン
 */

// ------------- スーパークラス定義
var SuperKlass = function SuperKlass(config, pv) {
  def(this, superProps, superMeths, config, pv);
};
var superProps = {};
superProps.prop1 = {type: String};
var superMeths = {};
superMeths.setProp1 = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.prop1 = val;
    }
  };
};

// ------------- サブクラス定義
var Klass = function Klass(config, pv) {
  def(this, props, meths, config, pv, SuperKlass);
};
var props = {};
props.prop2 = {type: String};
var meths = {};
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



