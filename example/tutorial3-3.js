'use strict';

/**
 * 引数確認に配列を含ませ、さらに要素の型を確認したい場合は次のようにします
 *
 *
 * paramsの型を[]で括ります
 */

var def = require('cocotte-define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.hobbies = {type: Array};
Klass.methods.setHobbies = function (pv) {
  return {
      params: [[String]],
      method: function (val) {
        pv.hobbies = val;
      }
    };
};

// ------------- ユーザーコード
var k = new Klass();
k.setHobbies(['jogging', 'tennes']);
console.log(k.value);