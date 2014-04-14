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

2.定義関数をコンストラクタ内で呼び出す


##プロパティの簡易な型指定
第２引数にプロパティの定義をします
`{type: 型}`を設定することで、自動的に型チェックを行うGetter/Setterがプロパティに設定されます

```javascript
var def = require('cocotte-define');

var Klass = function Klass() {
	def(this, props);
};
var props = {};
props.name = {type: String};

var k = new Klass();
k.name = 'foo';
```


## 初期値を持った定義

`value`を定義します

```javascript
props.name = {type: String, value: 'foo'};
```

## Getter/Setterを指定

プレイベート変数をひとつ引数に持つ関数を設定します
戻り値にgetterとsetterを設定したオブジェクトを返すようにします
valueは初期値に設定されます
いずれも省略する事が出来ます

```javascript
props.name = function (pv) {
	return {
		value: 'foo',
		getter: function () {
			return pv.name;
		},
		setter: function (val) {
			pv.name = val;
		}
	}
};
```

## メソッドを指定

第３引数にメソッドの定義をします
オブジェクトに対し、プレイベート変数をひとつ引数に持つ高階関数をメソッド名で追加します

```javascript
var Klass = function Klass() {
	def(this, null, meths);
};
var meths = {};
meths.setName = function (pv) {
	return function (val) {
		pv.name = val;
	};
};

var k = new Klass();
k.setName('foo');
```

## 引数の型を確認するメソッドを指定

戻り値をオブジェクトにしてparamsとmethodを設定してください
メソッドを実行する前に引数のチェックが行われます。

 + paramsの数以上の引数が渡されていないか？
 + 引数がnull,undefined以外の時に型が一致しているか？

引数は省略可能です。

```javascript
meths.setName = function (pv) {
	return {
		params: [String],
		method: function (val) {
			pv.name = val;
		}
	};
};
```

## コンストラクタに初期値を渡す

初期値をインスタンス作成時に設定するには、第４引数にオブジェクトを設定します
`{name:'foo'}`を設定した場合は、`this.name = 'foo'`が自動的に行われます

```javascript
var Klass = function Klass(config) {
	def(this, props, null, config);
};
var props = {};
props.name = {type: String};

var k = new Klass({name: 'foo'});
console.log(k.name); // foo 
```

## プライベート変数を外部から操作する

通常プライベート変数は、コンストラクタで作成されたものを使用するため
外部から操作する事ができません。

しかし、第５引数に設定することで可能になります。

```javascript
var Klass = function Klass(pv) {
	def(this, props, null, null, pv);
};
var props = {};
props.name = {type: String};

var pv = {}; // プライベート変数を格納するオブジェクト
var k = new Klass(pv);
k.name = 'foo';
console.log(pv.name); // foo 
```

## 継承

第６引数に親クラスを設定します
このライブラリを使用する親クラスのコンストラクタは、
第１引数に初期値、第２引数にプライベート変数とする必要があります。

```javascript
var SuperKlass = function SuperKlass (config, pv) {
	def (this, superProps, null, config, pv);
};
var superProps = {};
superProps.prop1 = {type: String};

var Klass = function Klass (config) {
	def (this, props, null, config, null, SuperKlass);
};
var props = {};
props.prop2 = {type: String};

var k = new Klass({prop1: 'foo'});
console.log(k.prop1); // 'foo'
```

## すべてのプロパティを取得

インスタンスをそのまま`console.log`などで標準出力すると
`{ name: [Getter/Setter]}`と表示されて値を一括で確認する事はできません。
そこで、`value`プロパティが自動的にインスタンスに追加されています。
valueは親クラスのプロパティも確認することができます。

```javascript
console.log(k.value);
```
