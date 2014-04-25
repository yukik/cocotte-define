'use strict';

var def = require('cocotte-define');

/**
 * prototypeにプロパティを設定 (getter/setter)
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
Klass.setProperty('prop1', {
  setter: function (val) {
    this.prop1_ = val;
  },
  getter: function () {
    return this.prop1_;
  }
});

// ------------- ユーザーコード
var k = new Klass();
k.prop1 = 'foo';
console.log(k.value); // prop1は存在せず、代わりにprop1_が存在します
console.log(k.prop1); // 値は取得出来ます

