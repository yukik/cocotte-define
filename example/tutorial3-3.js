'use strict';

/**
 * オーバーロードに対応するには配列を設定します
 */

var def = require('cocotte-define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {type: String};
Klass.methods.setName = function (pv) {
  return [
    {
      params: [String],
      method: function (val) {
        pv.name = val;
      }
    },
    {
      params: [Number],
      method: function (val) {
        this.setName('A' + val);
      }
    }
  ];
};

// ------------- ユーザーコード
var k = new Klass();
k.setName(123);
console.log(k.value);
