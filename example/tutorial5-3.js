'use strict';

var def = require('cocotte-define');

/**
 * prototypeにプロパティを設定 (type)
 *
 * 型に配列を設定した場合は、更に要素の型を指定する事が出来ます
 * itemに要素の型を指定してください
 *
 * nullを設定しても、取得時には空の配列が返されます。  
 * また取得した配列の要素に変更を加えても、プロパティの値は変更されません  
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('hobbies', {
  type: Array,
  item: String
});

// ------------- ユーザーコード
var k = new Klass();

k.hobbies = ['jogging', 'tennes'];
console.log(k.hobbies);

