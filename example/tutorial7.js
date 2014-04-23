'use strict';

var def = require('cocotte-define');

/**
 * prototypeにプロパティを設定 (type)
 *
 * tutorial1の次の設定方法との違い
 *   Klass.properties.prop1 = {type: String};
 *
 * Getter/Setter
 *   tutorial1はインスタンスに設定されるのに対し、
 *   prototypeに設定されます
 *   メモリ効率はsetPropertyを使用した方が良くなります
 *
 * 実の値の格納方法
 *   tutorial1はプライベート変数に格納されるのに対し、
 *   プロパティ名 + '_'のパブリック変数に格納されます
 * 
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('prop1', {type: String});

// ------------- ユーザーコード
var k = new Klass();

k.prop1 = 'foo';

console.log(k.value); // prop1の代わりにprop1_と表示されます
console.log(k.prop1); // 値は普通に取得出来ます

