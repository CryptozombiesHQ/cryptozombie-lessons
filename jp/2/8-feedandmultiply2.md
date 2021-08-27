---
title: ゾンビ DNA
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // ここから開始せよ
          }

        }
      "zombiefactory.sol": |
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

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) private {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

`feedAndMultiply`関数を完成させるぞ。

新しいゾンビのDNAを計算する方法なんて簡単だ：元のゾンビのDNAと捕食された人間のDNAの平均値を出すだけでいい。

例えば：

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // この例だと 3333333333333333だ。
}
```

もし新しいゾンビのDNAにランダム性を追加したいとか、複雑にすることも可能だ。だが、今の所は簡単でいい。あとからいつでもできるからな。

# それではテストだ

1. まず、`_targetDna`が16桁であることを確認せよ。`_targetDna`を `_targetDna % dnaModulus`と同様にして最後の16桁だけ取り出せば良い。

2. 次に`newDna`という名前の`uint`関数を宣言し、`myZombie`のDNAと`_targetDna`の平均値を設定せよ（上の例と同じだ）。

  > 注:`myZombie.name` と `myZombie.dna`を使って`myZombie`プロパティにアクセスできます。

3. 新しいDNAを手に入れたら、`_createZombie`を呼び出すように。どのパラメータを呼び出せばいいかわからなくなったら、`zombiefactory.sol` を参照せよ。名前が必要になるから、とりあえず`"NoName"` と名付けておくように。ゾンビの名前を変更する関数はあとで教えてるからしばし待て。

> 注:Solidityが何かのエラーを出しても気にする必要がありません！次のチャプターで修正します ;)



