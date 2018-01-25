---
title: イベント
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // declare our event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // and fire it here
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

我々のコントラクトももう直ぐ完成だ！そこで、**_event_**を追加しよう。

**_Events_** は、ブロックチェーンで何かが生じたときに、コントラクトがアプリのフロントエンドに伝えることができるものだ。しかも特定のイベントを'listening'状態にして、何かあった時にアクションを起こすこともできるのだ。

例：

```
// イベントの宣言
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // 関数が呼ばれたことをアプリに伝えるためにイベントを発生させる：
  IntegersAdded(_x, _y, result);
  return result;
}
```

Your app front-end could then listen for the event. A javascript implementation would look something like: 

```
YourContract.IntegersAdded(function(error, result) { 
  // do something with result
}
```

# それではテストだ

We want an event to let our front-end know every time a new zombie was created, so the app can display it.

1. Declare an `event` called `NewZombie`. It should pass `zombieId` (a `uint`), `name` (a `string`), and `dna` (a `uint`).

2. Modify the `_createZombie` function to fire the `NewZombie` event after adding the new Zombie to our `zombies` array. 

3. You're going to need the zombie's `id`. `array.push()` returns a `uint` of the new length of the array - and since the first item in an array has index 0, `array.push() - 1` will be the index of the zombie we just added. Store the result of `zombies.push() - 1` in a `uint` called `id`, so you can use this in the `NewZombie` event in the next line.
