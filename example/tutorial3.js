'use strict';

/**
 * メソッドの定義ではプロベート変数を一つだけ引数に取る高階関数を
 * 定義します
 */

var def = require('cocotte-define');

// ------------- クラス定義

var Klass = function Klass() {
  // プロパティ定義を行う
  def(this, null, meths);
};

// メソッド定義
var meths = {};

// プロパティ定義の例
meths.setName = function (pv) {
  return function (val) {
    pv.name = val;
  };
};

// プロパティ定義の例
meths.getName = function (pv) {
  return function () {
    return pv.name;
  };
};

// ------------- ユーザーコード

var k = new Klass();

// メソッドの実行
k.setName('foo');
console.log(k.getName());