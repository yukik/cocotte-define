'use strict';

/**
 * Getter/Setterでのプロパティの設定です
 * プライベート変数を設定・取得出来ます
 *
 * 設定時や取得時に細かな処理を記述する場合はこの方法を使用します
 * また、GetterのみSetterのみを指定する事で読取専用・書込専用のプロパティを
 * 記述する事も出来ます
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