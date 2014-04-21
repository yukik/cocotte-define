cocotte-define
======

クラス定義のヘルパー

# はじめに

javascriptでクラスを定義することを簡単かつ安全に行うためのヘルパーです。
プライベート変数と継承の同時に実装すると煩雑になりやすいですが、
ヘルパー関数を使用する事で保守しやすくなります。

#機能

 + 簡易の型チェック
 + Getter/Setterの設定
 + メソッドの引数の型チェック
 + プライベート変数
 + 継承
 + プロパティのすべての値の一括取得

#使用方法

1.プロパティとメソッドの定義を行う

2.定義関数をクラスに設定する

3.初期化関数をコンストラクタ内で呼び出す


## ヘルパーの呼び出し

node.jsでは次のようにします

```
var def = require('cocotte-define');
```

以下のサンプルコードでは`def`を使用します


##プロパティの簡易な型指定
Klassにpropertiesオブジェクトを設定します
`{type: 型}`を設定することで、自動的に型チェックを行うGetter/Setterがプロパティに設定されます

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties = {name: {type: String}};

var k = new Klass();
k.name = 'foo';
```

## Getter/Setterを指定

プレイベート変数をひとつ引数に持つ関数を設定します
戻り値にgetterとsetterを設定したオブジェクトを返すようにします

getterを省略すると書込専用のプロパティになります。
setterを省略すると読取専用のプロパティになります。

```javascript
Klass.properties = {
  name: function (pv) {
    return {
      getter: function () {
        return pv.name;
      },
      setter: function (val) {
        pv.name = val;
      }
    };
  }
};
```

## メソッドを指定

Klassにmethodsオブジェクトを定義をします
プレイベート変数をひとつ引数に持つ高階関数をメソッド名で追加します

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.methods = {
  setName: function (pv) {
    return function (val) {
      pv.name = val;
    };
  }
};

var k = new Klass();
k.setName('foo');
```

## 引数の型を確認するメソッドを指定

オブジェクトを戻す関数を定義します。
そのオブジェクトにparamsとmethodを設定してください

paramsによりmethodを実行する前に引数のチェックが行われます。

 + paramsの数以上の引数が渡されていないか？
 + 引数がnull,undefined以外の時に型が一致しているか？

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.methods = {
  setName: function (pv) {
    return {
      params: [String],
      method: function (val) {
        pv.name = val;
      }
    };
  }
};
var k = new Klass();
k.setName('foo');
```

## 継承

定義関数の第2引数に親クラスを設定します。
初期化関数は親クラスのコンストラクタを呼び出します。
初期化関数の第2引数より後は、親クラスのコンストラクタに引き渡される値です。

```javascript
var SuperKlass = function SuperKlass (prop1) {
  this.def(SuperKlass);
  this.prop1 = prop1;
};
def(SuperKlass);
SuperKlass.properties = {
  prop1: {type: String}
};

var Klass = function Klass (prop1, prop2) {
  this.def(Klass, prop1);
  this.prop2 = prop2;
};
def(Klass, SuperKlass);
Klass.properties = {
  prop2: {type: String}
};

var k = new Klass('foo', 'bar');
console.log(k.prop1); // 'foo'
```

## すべてのプロパティを取得

インスタンスをそのまま`console.log`などで標準出力すると
`{ name: [Getter/Setter]}`と表示されて値を一括で確認する事はできません。
そこで、`value`プロパティが自動的にインスタンスに追加されています。
valueは親クラスで定義されたプロパティも確認することができます。

```javascript
var k = new Klass('foo', 'bar');
console.log(k.value);
```
