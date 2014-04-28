'use strict';
/**
 * 入力値を設定前に、適切な値に変換する場合は`exchange`を追加します
 * `from`に型を指定し、`to`に変換を行う関数を定義します
 *
 * 複数の型を指定した変換を行いたい場合は、配列を設定してください
 * 先に設定した条件が一回だけ適用されます
 * 複数の変換が同時に適用される事はありません
 * 
 */
var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = {
  exchange: {
    from: String,
    to: function (val) {
      return new Date(val);
    }
  },
  // 上記と同じ
  // exchange: [
  //   {
  //     from: String,
  //     to: function (val) {
  //       return new Date(val);
  //     }
  //   }
  // ],
  type: Date
};

// ------------- ユーザーコード
var k = new Klass();
k.birthday = '1990-5-29';
console.log(k.birthday);





