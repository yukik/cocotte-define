'use strict';

var def = require('cocotte-define');

/**
 * prototypeメソッド
 * 
 * オーバーロードに対応するには、同じ名称のメソッドを定義します
 * 追加した順に引数型のの確認が行われます
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setMethod('meth1', {
  params: [String],
  method: function (val) {
    this.prop1 = val;
  }
});
Klass.setMethod('meth1', {
  params: [Number],
  method: function (val) {
    this.meth1('A' + val);
  }
});

// ------------- ユーザーコード
var k = new Klass();
k.meth1(123);
console.log(k.value);

