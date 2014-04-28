'use strict';
/**
 * 変換時に、配列の型の時のみ、要素の型を指定する事ができます
 * exchangeにitemを指定してください
 */
var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.serial = {
  exchange: {
    from: Array,
    item: Number,
    to: function (val) {
      return val.join('-');
    }
  },
  type: String
};

// ------------- ユーザーコード
var k = new Klass();
k.serial = [123, 4567, 890];
console.log(k.serial);





