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

// プロパティ定義
Klass.properties.name = function (pv) {
  return {
    getter: function () {
      return pv.name;
    },
    setter: function (value) {
      pv.name = value;
    }
  };
};

// ------------- ユーザーコード
var k = new Klass();

// 値の設定
k.name = 'bar';

// プロパティの取得
console.log(k.name);
