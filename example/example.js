'use strict';

var def = require('../define');

// ------------- クラス定義
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);

Klass.properties.name = {type: String};

Klass.properties.birthday = {type: Date};

Klass.properties.age = function (pv) {
  return {
    getter: function () {
      return pv.birthday ? getAge(pv.birthday, new Date()) : null;
    }
  };
};

Klass.properties.nameLength = function(pv){
  return {
    getter: function() {
      return pv.name ? pv.name.length : null;
    }
  };
};

Klass.methods.getAge = function (pv) {
  return {
    params: [Date],
    method: function (val) {
      return getAge(pv.birthday, val || new Date());
    }
  };
};

// 年齢の計算
function getAge (birthday, when) {
  if (!birthday || !when) {
    return null;
  }
  var b = new Date(birthday.getTime()).setFullYear(2000);
  var w = new Date(when.getTime()).setFullYear(2000);
  return when.getFullYear() - birthday.getFullYear() - (b <= w ? 0: 1);
}

// ------------- ユーザーコード
var k = new Klass();

k.name = 'foo';
k.birthday = new Date('1980-3-22');

console.log(k.getAge(new Date('2000-2-14')));
console.log(k.value);
