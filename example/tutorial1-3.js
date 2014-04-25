'use strict';

/**
 * exchangeを予め定義されたDate型のプロパティを設定できます
 */
var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = def.Date;

// ------------- ユーザーコード
var k = new Klass();
k.birthday = '1990-11-9';
console.log(k.birthday);




