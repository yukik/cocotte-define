cocotte-define
======

クラス定義のヘルパー

#機能

 + 簡易の型チェック
 + Getter/Setterの設定
 + プライベート変数
 + プロパティのすべての値の一括取得

#使用方法

1.プロパティとメソッドの定義を行う

2.定義関数をコンストラクタ内で呼び出す


##プロパティの簡易な型指定

{type: 型のコンストラクタを指定}を設定することで、
自動的に型チェックを行うGetter/Setterがプロパティに設定されます


```js
var def = require('cocotte-define');

// ------------- クラス定義

var Klass = function Klass() {
	// プロパティ定義を行う
	def(this, props);
};

// プロパティ定義
var props = {};

// プロパティ定義の例
props.name = {type: String};

// ------------- ユーザーコード

var k = new Klass();

// 値の設定
k.name = 'foo';
// k.name = 123; // 例外発生

```

## 初期値を持った定義

`value`を定義します

```js
props.name = {type: String, value: 'foo'};
```

## Getter/Setterを指定

プレイベート変数をひとつ引数に持つ関数を設定します
戻り値にgetterとsetterを設定したオブジェクトを返すようにします
valueは初期値に設定されます
いずれも省略する事が出来ます

```js
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

プレイベート変数をひとつ引数に持つ高次関数を設定します

```js
var def = require('cocotte-define');

// ------------- クラス定義

var Klass = function Klass() {
	// プロパティ定義を行う
	def(this, null, meths);
};

// メソッド定義
var meths = {};

// メソッド定義の例
meths.setName = function (pv) {
	return function (val) {
		pv.name = val;
	};
};

// ------------- ユーザーコード

var k = new Klass();

メソッドの実行
k.setName('foo');
```

## 引数の型を確認するメソッドを指定

戻り値をオブジェクトにしてparamsとmethodを設定してください
メソッドを実行する前に引数のチェックが行われます。

 + paramsの数以上の引数が渡されていないか？
 + 引数がnull,undefined以外の時に型が一致しているか？

引数は省略可能です。

```
meths.setName = function (pv) {
	return {
		params: [String],
		method: function (val) {
			pv.name = val;
		}
	};
};
```
