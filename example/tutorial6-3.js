'use strict';

var def = require('cocotte-define');

/**
 * prototypeプロパティ (getter/setter)
 *
 * 型変換を行った後に、setterの引数にします
 * 
 */

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('birthday', {
  exchange: {
    from: String,
    to: function (val) {
      return new Date(val);
    }
  },
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
k.birthday = '1990-4-13';
console.log(k.birthday);

