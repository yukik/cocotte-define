cocotte-define
======

クラス定義のヘルパー

# はじめに

javascriptでクラスを定義することを簡単かつ安全に行うためのヘルパーです。
プライベート変数と継承の同時に実装すると煩雑になりやすいですが、
ヘルパー関数を使用する事で簡単に実装出来、保守しやすくなります。

#機能

 + 簡易の型チェック
 + Getter/Setterの設定
 + メソッドの引数の型チェック
 + プライベート変数
 + 継承
 + プロパティのすべての値の一括取得
 + prototypeへの設定
 + 入力値の変換

#使用方法

1.定義関数をクラスに設定する

2.プロパティとメソッドの定義を行う

3.初期化関数をコンストラクタ内で呼び出す

## ヘルパーの呼び出し

node.jsでは次のようにします

```
var def = require('cocotte-define');
```

以下のサンプルコードでは`def`を使用します

## 定義関数・初期化関数の設定

定義関数により次の事が実行されます。

  + prototypeに初期化関数のdefが追加されます
  + クラスのproperties,methodsにアクセス出来るようになります
  + クラスにsetPropery,setMethodのヘルパー系関数を追加します
  + 継承を設定します

初期化関数により次の事が実行されます。

  + インスタンスにプライベート変数を利用可能なプロパティを設定します
  + インスタンスにプライベート変数を利用可能なメソッドを設定します
  + インスタンスにvalueプロパティを設定します

```javascript
var Klass = function Klass() {
  // 初期化関数
  this.def(Klass);
};
// 定義関数
def(Klass);
```

## プロパティの簡易な型指定

Klassのpropertiesに定義します。  
`{type: 型}`を設定することで、自動的に型チェックを行います

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {type: String};

var k = new Klass();
k.name = 'foo';
```

## 入力値を変換して設定する

`exchange`を設定します。  
`from`に対象の型を指定し、`to`に変換するための関数を設定します  
変換後の値も同様に`type`との型チェックされます。  
また、typeと同じ型のtoを設定した場合も１回だけ変換されます  
変換後の値が再度ほかの型で変換される事はありません。  

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {
  type: Date,
  exchange: {
    from: String,
    to: function (val) {
      return new Date(val);
    }
  }
};

var k = new Klass();
k.name = 'foo';
```

変換を行いたい型が複数存在する場合は、`exchange`を配列にします。  
最初に一致した型が１回だけ適用されます。  
複数の変換が同時に行われる事はありません。

```javascript
 exchange: [
  {
    from: String,
    to: function (val) {
      return new Date(val);
    }
  },
  {
    from: Number,
    to: function (val) {
      return new Date(val);
    }
  }
  ]
```

## Getter/Setterを指定

プライベート変数をひとつ引数に持つ関数を設定します
戻り値にgetterとsetterを設定したオブジェクトを返すようにします

getterを省略すると書込専用のプロパティになります。  
setterを省略すると読取専用のプロパティになります。  

先の「プロパティの簡易な型指定」で定義されたプロパティもプライベート変数に設定されているため、
同名で取得して設定等に使用する事ができます。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = function (pv) {
  return {
    setter: function (val) {
      pv.name = val;
    }
    ,getter: function () {
      return pv.name;
    }
  };
};

var k = new Klass();
k.name = 'foo';
```

## 型を指定したGetter/Setter

設定時の`type`を指定します。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = function (pv) {
  return {
    type: String,
    getter: function () {
      return pv.name;
    },
    setter: function (val) {
      pv.name = val;
    }
  };
};

var k = new Klass();
k.name = 'foo';
```

## メソッドを指定

Klassの`methods`に定義をします。  
プライベート変数をひとつ引数に持つ高階関数をメソッド名で追加します

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.methods.setName = function (pv) {
  return function (val) {
    pv.name = val;
  };
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
Klass.methods.setName = function (pv) {
  return {
    params: [String],
    method: function (val) {
      pv.name = val;
    }
  };
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
SuperKlass.properties.prop1 = {type: String};

var Klass = function Klass (prop1, prop2) {
  this.def(Klass, prop1);
  this.prop2 = prop2;
};
def(Klass, SuperKlass);
Klass.properties.prop2 = {type: String};

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

# prototypeに設定しメモリ効率化

上記のプロパティおよびメソッドの定義は、プライベート変数を簡単に使用する事ができます。  
しかし、インスタンスに対して設定されているため、メモリ効率はよくありません。  

プライベート変数への設定・取得のないプロパティやメソッドの定義は次のように行ってください。  

また、`prototype`に設定されたプロパティは、`value`プロパティで取得対象にはなりません。  
インスタンスに通常に設定された値を確認する事で対応できます  
そのため、値の完全な保護を行う事はできません。

カプセル化とメモリの節約のどちらを優先するかで利用を選択してください


## プロパティの簡易な型指定 (prototype)

`setProperty`を使用する事で、自動的に型チェックを行うGetter/Setterを定義します  
実際に設定された値は、プロパティに`_`を追加した名称で登録され外部からも参照可能です。

```
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('name', {type: String});

var k = new Klass();
k.name = 'foo';
```

## Getter/Setterを指定 (prototype)

getterを省略すると書込専用のプロパティになります。  
setterを省略すると読取専用のプロパティになります。  

値を格納する場合は、別のインスタンスのプロパティを参照する必要があります

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setProperty('name', {
  getter: function () {
    return this.name_;
  },
  setter: function (val) {
    this.name_ = val;
  }
});

var k = new Klass();
k.name = 'foo';
```

## メソッドを指定 (prototype)

`setMethod`を使用します。  
`params`, `method`は必ず指定します。  
プライベート変数を取得・変更出来ない事をのぞくと
「引数の型を確認するメソッドを指定」と同様の動作をします。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.setMethod('setName', {
  params: [String],
  method: function (val) {
    this.name = val;
  }
});
var k = new Klass();
k.setName('foo');
```

引数または型確認が不要の場合は、通常の方法でprototypeに追加してください。  
その方が無駄がありません。

```javascript
Klass.prototype.setName = function (val) {
  this.name= val;
};
```

