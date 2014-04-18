'use strict';


/**
 * 引数チェックを行うメソッドを定義する事が出来ます
 * 戻り値に関数の代わりにオブジェクトを指定します
 * paramsに引数の型を列挙し、methodに関数を指定します
 * 実行時に型が合わない場合は例外が発生します
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
  return {
    params: [String],
    method: function (val) {
      pv.name = val;
    }
  };
};

// ------------- ユーザーコード

var k = new Klass();

// メソッドの実行
k.setName('foo');

// k.setName(123); // 例外
