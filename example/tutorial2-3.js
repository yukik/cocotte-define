'use strict';

/**
 * Getter/Setter
 *
 * exchangeとtypeを両方設定する事で、変換後の値を型確認をしてsetterを
 * 実行する事が出来ます
 */

var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = function (pv) {
  return {
    exchange: {from: String, to:function(val) { return new Date(val);}},
    type: Date,
    setter: function (val) {
      pv.birthday = val;
    },
    getter: function () {
      return pv.birthday;
    }
  };
};

// ------------- ユーザーコード
var k = new Klass();
k.birthday = '1990-4-12';
console.log(k.birthday);