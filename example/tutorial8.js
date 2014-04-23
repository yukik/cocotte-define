'use strict';

var def = require('cocotte-define');

/**
 * prototypeにプロパティを設定 (getter/setter)
 *
 * Getter/Setterを手動で設定します
 * tutorial2と似ていますが、プライベート変数を設定・取得する事ができません
 * prototypeに設定されるためメモリ効率はよくなります。
 * 
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('prop1', {
  getter: function () {
    return this.prop1_;
  },
  setter: function (val) {
    this.prop1_ = val;
  }
});


// ------------- ユーザーコード
var k = new Klass();

k.prop1 = 'foo';

console.log(k.value); // prop1の代わりにprop1_と表示されます
console.log(k.prop1); // 値は普通に取得出来ます

