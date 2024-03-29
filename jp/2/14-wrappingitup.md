---
title: まとめ
actions: ['答え合わせ', 'ヒント']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

これでレッスン2は終了だ。よくやった！

実際の動作を確認したければ右のデモを使用するといい。さぁやって見ろ。触ってみたいだろ。我慢する必要はないぞ😉。犠牲にする子猫を選択して、新しい猫ゾンビを作り上げるのだ！

## JavaScript の実装

このコントラクトをイーサリアムで実行する準備ができたら、コンパイルして`ZombieFeeding`を実行するだけで良い。このコントラクトは`ZombieFactory`を継承した最終コントラクトであり、両方のコントラクトのpublicメソッドにアクセスできるからな。

それじゃあ、JavaScript とweb3.jsを使用して実行したコントラクトがやりとりする例を出してやろう：

```
var abi = /* abiはコンパイラが生成してくれる */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* デプロイ後に得られるイーサリアムのコントラクトアドレス */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// ゾンビのIDと捕食したい子猫のIDをすでに持っているものとする。
let zombieId = 1;
let kittyId = 1;

// クリプトキティの画像を取得するにはweb APIに照会する必要がある。
// この情報はブロックチェーンにはない。ウェブサーバーにあるだけだ。
// もし全ての情報がブロックチェーン上に格納されていれば、サーバーの
// 障害を心配することはなくなるがな。まぁこのゾンビゲームを気に入ってもらえなければ、
// APIを変更するか我々のアクセスをブロックするだけだ。問題ない ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // 画像を表示する部分だ
})

// ユーザーが子猫をクリックししたときの処理だ：
$(".kittyImage").click(function(e) {
  // コントラクトの`feedOnKitty` メソッドを呼び出す
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// コントラクトのNewZombieイベントをリッスンして表示できるようにする部分だ：
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // この関数はレッスン1でやったのと同じようにゾンビを表示するものだ：
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# さぁ、やってみるのだ！

ゾンビに捕食させたい子猫を選択せよ。ゾンビのDNAと子猫のDNAが結合し、ゾンビ軍団に加わる新しいゾンビが誕生するのだ！

新しいゾンビの足が猫の足になっているだろ？DNAの最後の2桁`99`がここに作用しているのだ 😉

何度でも試して構わないぞ。いい感じの猫ゾンビができたら（選べるのは1匹だけだぞ）、次のチャプターへ進み、レッスン2を完了するのだ！
