'use strict';

/**
 * 型を指定したプロパティを設定します
 * 異なる型の値を設定しようとすると例外が発生します
 * nullとundefinedは例外を発生させずにともにnullが設定されます
 * 
 * 同名でプライベート変数に設定されています
 *
 * また、クラスに自動的にvalueのプロパティが追加されており
 * 取得するとすべての設定されたプロパティの値を持つオブジェクトが返されます
 */

var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
  this.age = 30;
};
def(Klass);

// プロパティ定義
Klass.properties.name = {type: String};
Klass.properties.age = {type: Number};

// ------------- ユーザーコード
var k = new Klass();

// 値の設定
k.name = 'foo';

// k.name = 123; // 例外発生

// プロパティの取得
console.log(k.name);

// プロパティの全ての値の取得
console.log(k.value);



