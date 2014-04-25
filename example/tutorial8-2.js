'use strict';

var def = require('cocotte-define');

/**
 * Serrt (getter/setter)
 *
 * Getter/Setterを手動で設定します
 * tutorial2と似ていますが、プライベート変数を設定・取得する事ができません
 * prototypeに設定されるためメモリ効率はよくなります。
 *
 * getterのみ指定すると読取専用、setterのみ指定すると書込専用になります
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

