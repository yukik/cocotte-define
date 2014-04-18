'use strict';

/**
 * 型を指定したプロパティを設定します
 * 異なる型の値を設定しようとすると例外が発生します
 * nullとundefinedは例外を発生させずにともにnullが設定されます
 * 初期値はvalueを設定しないかぎりnullです
 *
 * また、クラスに自動的にvalueのプロパティが追加され
 * 取得するとすべての設定されたプロパティの値を持つオブジェクトが返されます
 *
 * 設定されていない値はnullを返します
 */

var def = require('../define');

// ------------- クラス定義

var Klass = function Klass() {
  // プロパティ定義を行う
  def(this, props);
};

// プロパティ定義
var props = {};

// プロパティ定義の例
props.name = {type: String};
props.age = {type: Number, value: 20};

// ------------- ユーザーコード

var k = new Klass();

// 値の設定
k.name = 'foo';

// k.name = 123; // 例外発生



// プロパティの取得
console.log(k.name);

// プロパティの全ての値の取得
console.log(k.value);

