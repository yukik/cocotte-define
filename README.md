cocotte-define
======

クラス定義のヘルパー

# はじめに

javascriptでクラスを定義することを簡単かつ安全に行うためのヘルパーです。  
プライベート変数と継承の同時に実装すると煩雑になりやすいですが、
ヘルパー関数を使用する事で簡単に実装出来、保守しやすくなります。

# 主な機能

 + プライベート変数のサポート
 + プロパティの簡易の型確認
 + プロパティのGetter/Setterの設定
 + プロパティのすべての値の一括取得
 + メソッドの引数の型確認
 + メソッドのオーバーロード
 + 入力値の変換
 + 継承
 + prototypeへの設定


#動作環境

## node

ver0.10-

## クライアントサイド

依存しているライブラリはありません  
[es5](http://kangax.github.io/es5-compat-table/)に順序しているものが動作保証されています。  
ただし現在、クライアントサイドでの検証は不十分です。  
不具合報告は[github issue](https://github.com/yukik/cocotte-define/issues)までよろしくお願いします

#使用方法

## ヘルパーの呼び出し

クライアントサイドで使用する場合はclient.jsをロードしてください。  
規定のネームスペースは`Cocotte`で、クラス定義のヘルパーは`classDefine`です。  
それぞれ編集したい場合は、直接ファイルの最初と最後を編集してください。  
規定のままであれば次のように使用できます。

```html
<script src='cocotte-define/client.js'></script>
<script>
var def = Cocotte.classDefine;
</script>
```

node.jsではnpmに公開していますので次のようにします  

コマンドプロンプト

```
npm install cocotte-define
```

呼び出し

```javascript
var def = require('cocotte-define');
```

 > 以後のサンプルコードでは`def`を使用します。  
 > 特にクライアントサイドの場合は、グローバル変数の衝突に注意して適切に置き換えてください

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


定義・動作は次の順で行われています

1.定義関数をクラスに設定する  
2.プロパティとメソッドの定義を行う  
3.初期化関数をコンストラクタ内で呼び出す

```javascript
var Klass = function Klass() {
  // 初期化関数
  this.def(Klass);
};
// 定義関数
def(Klass);
// 以下プロパティとメソッドの定義
```

## プロパティの簡易な型指定

Klassのpropertiesに定義します。  
`{type: 型}`を設定することで、自動的に型確認を行います。  
値がnull/undefinedの場合は型確認を行いません

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = {type: String};

var k = new Klass();
k.name = 'foo';
```

## 配列を型指定する

型に配列を設定した場合は、更に要素の型を指定する事が出来ます。  
`item`に要素の型を指定してください。  
`null`を設定しても、取得時には空の配列が返されます。  
また取得した配列の要素に変更を加えても、元のプロパティの値は変更されません。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.hobbies = {
  type: Array,
  item: String
};

var k = new Klass();
k.hobbies = ['tennes', 'jogging'];
```

## 入力値を変換して設定する

`exchange`を設定します。  
`from`に対象の型を指定し、`to`に変換するための関数を設定します  
変換後の値も同様に`type`との型確認されます。  
また、typeと同じ型のtoを設定した場合も１回だけ変換されます  
変換後の値が再度ほかの型で変換される事はありません。  

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = {
  type: Date,
  exchange: {
    from: String,
    to: function (val) {
      return new Date(val);
    }
  }
};

var k = new Klass();
k.birthday = '1990-3-20';
```

`from`が`Array`の時には、さらに`item`を指定する事で各要素の型を指定することができます。  
以下の例では、入力値が`['foo', 'bar', 'baz']`の際には設定されますが、  
`[1, 2, 3]`の場合は例外が発生します。

```
exchange: {
  from: Array,
  item: String,
  to: function (val) {
    return val.join('-');
  }
}
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

Date型は予めStringをDateに変換するexchangeを含んだものを用意しています。  
`Klass.properties.birthday = def.Date;`と簡易に設定できます


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
    },
    getter: function () {
      return pv.name;
    }
  };
};

var k = new Klass();
k.name = 'foo';
```

## Setterの前に入力値の型を確認する

`type`を指定します。  
`Setter`が実施される前に、型が一致しているかを確認します  
値がunll/undefinedの場合は型確認をおこないません。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.name = function (pv) {
  return {
    type: String,
    setter: function (val) {
      pv.name = val;
    },
    getter: function () {
      return pv.name;
    }
  };
};

var k = new Klass();
k.name = 'foo';
```

## Setterの前に入力値を変換する

`exchange`を設定します。  
設定方法は「簡易な型指定」と同じです

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
Klass.properties.birthday = function (pv) {
  return {
    exchange: {
      from: String,
      to: function (val) {
        return new Date(val);
      }
    },
    type: Date,
    setter: function (val) {
      pv.birthday = val;
    },
    getter: function () {
      return pv.birthday;
    }
  };
};

var k = new Klass();
k.birthday = '1990-3-20';
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

paramsによりmethodを実行する前に引数の型確認が行われます。

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

引数の一つの型が配列の場合は、各要素の型も指定出来ます。  
その際は、`Array`のかわりに`[Date]`などを指定してください。  
下記の例では、第2引数は日付型の配列でなければいけません。

```
Klass.methods.setHolidays = function (pv) {
  return {
    params: [String, [Date]],
    method: function (name, Holidays) {
      pv.holidays[name] = holidays;
    }
  };
};
```

## メソッドのオーバーロード

引数の型を確認する場合は、オーバーロードを設定する事が出来ます。  
定義オブジェクトの配列を設定してください。  
引数の型に一致したメソッドが呼び出されます。  
null/undefinedはすべての型と一致すると判断されます。

```javascript
var Klass = function Klass() {
  this.def(Klass);
};
def(Klass);
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

var k = new Klass();
k.setName(123);
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

`setProperty`を使用する事で、自動的に型確認を行うGetter/Setterを定義します  
実際に設定された値は、プロパティに`_`を追加した名称で登録され外部からも参照可能です。

```javascript
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

値を格納する場合は、プロパティ名とは別のプロパティを指定する必要があります

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

配列の要素の型を指定する場合は次の用に行います。  

```
Klass.setMethod('setHolidays', {
  params: [String, [Date]],
  method: function (name, holidays) {
    this.holidays[name] = holidays;
  }
});
```

引数または型確認が不要の場合は、下記の方法でprototypeに追加してください。  
その方が無駄がありません。

```javascript
Klass.prototype.setName = function (val) {
  this.name= val;
};
```

## メソッドのオーバーロード (prototype)

同じメソッド名で`setMethod`を定義します。  
定義された順に引数の確認が行われ、一致したメソッドが実行されます

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
Klass.setMethod('setName', {
  params: [Number],
  method: function (val) {
    this.setName('A' + val);
  }
});
var k = new Klass();
k.setName(123);
```


# 最後に

クラス定義の際に、プロパティとメソッドをインスタンスとprototypeのどちらに
設定する方がよいのか迷った場合、  
次のようにすることをオススメします。  

プロパティは、インスタンス。`Klass.properties`に設定する。  
メソッドは、prototype。`Klass.setMethod`を呼び出し、設定する。  

プロパティは実際の値を格納する為にどうしても、値の保護を優先する必要があります。  
そのため、プライベート変数を利用するほうが安全になります。  

メソッドから直接プライベート変数を呼び出す事は稀で、
プロパティ経由で値を取得・設定を行う事で処理も簡略化できます。  
メモリを効率化するためにも有効です。  

ただし上記のルールは、場面により不適切な場合もあるため、適宜判断する必要があります。

