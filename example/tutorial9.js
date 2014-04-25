'use strict';

var def = require('cocotte-define');

/**
 * prototypeにメソッドを設定
 * paramsに引数の型を指定します。
 * methodが実行される前に型確認をし、合わない場合は例外が発生します
 * 
 * tutorial4と似ていますが、プライベート変数を設定・取得する事ができません
 * prototypeに設定されるためメモリ効率はよくなります。
 *
 * 引数または型確認が不要の場合は、通常の方法でprototypeに追加してください
 * その方が無駄がありません。
 * 
 *   Klass.prototype.meth1 = function (val) {
 *     this.prop1= val;
 *   };
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

// ------------- ユーザーコード
var k = new Klass();

k.meth1('foo');

// k.meth1(123); // 例外

console.log(k.value);

