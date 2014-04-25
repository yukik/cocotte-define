'use strict';

/**
 * メソッドの定義ではプロベート変数を一つだけ引数に取る高階関数を定義します
 */

var def = require('cocotte-define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.methods.setName = function (pv) {
  return function (val) {
    pv.name = val;
  };
};
Klass.methods.getName = function (pv) {
  return function () {
    return pv.name;
  };
};

// ------------- ユーザーコード
var k = new Klass();

// メソッドの実行
k.setName('foo');
console.log(k.getName());