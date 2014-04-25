'use strict';

var def = require('cocotte-define');

/**
 * prototypeプロパティ (getter/setter)
 *
 * setterの入力値の型を確認します
 * typeを追加してください
 * 
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('birthday', {
  type: Date,
  setter: function (val) {
    this.birthday_ = val;
  },
  getter: function () {
    return this.birthday_;
  }
});

// ------------- ユーザーコード
var k = new Klass();
k.birthday = new Date('1990-4-13');
console.log(k.birthday);

