'use strict';

/**
 * Getter/Setter
 *
 * typeを指定する事でsetterの実行前に入力値の型確認を行う事が出来ます
 */

var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = function (pv) {
  return {
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
k.birthday = new Date('1990-4-12');
console.log(k.birthday);