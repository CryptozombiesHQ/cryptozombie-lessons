---
title: "ボーナス: Kitty Genes"
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // この関数の定義を編集せよ
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // ここにifステートメントを追加せよ
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // この関数呼び出しを編集せよ
            feedAndMultiply(_zombieId, kittyDna);
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

            function _createZombie(string _name, uint _dna) internal {
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
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(_species) == keccak256("kitty")) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

これで完成だ....ついでにもう一つだけボーナスで追加機能を教えてやろう。

せっかく子猫達からゾンビをつくったのだ。それっぽい特徴をつけて猫ゾンビにしてやろうではないか。

ゾンビのDNAに特別な子猫コードを追加すれば可能だ。

レッスン1のことを思い出してみろ。ゾンビの外見を決めるのに、16桁の数字のうち最初の12桁だけしか使っていなかったはずだ。余っているうちの最後の2桁を使って”特別な”特徴を追加していくぞ。

とりあえず、猫ゾンビはDNAの末尾を`99`にするぞ。猫に九生有りというしな。コードには`if`を使ってゾンビが猫から作られたどうかを判定して、DNAの末尾の2桁を`99`に設定するぞ。

## If ステートメント

SolidityのIfステートメントはJavaScript と同じようなものだ；

```
function eatBLT(string sandwich) public {
  // 文字列を比較するときに、 keccak256を使って
  // ハッシュを比較したことを思い出してくれよ
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# それではテストだ

ゾンビコードに猫の遺伝子を実際に組み込むぞ。

1. まず、`feedAndMultiply`の関数定義を変更して、 `_species`という名前の`string`の引数を取得できるようにせよ

2. 次に、新しいゾンビのDNAを計算後に、`if`ステートメントを使用して、`_species`の`keccak256`ハッシュと文字列の`"kitty"`を比較して同じかどうかを判定せよ。

3. `if`ステートメント内で最後の2桁を`99`に変更したい。一つの方法としてはこういうものがある： `newDna = newDna - newDna % 100 + 99;`

  > 解説: `newDna` を`334455`と仮定して考えて見ます。そうすると `newDna % 100` は `55`になり、`newDna - newDna % 100` は`334400`です。最後に `99`を追加して`334499`という値を取得します。

4. 最後に、`feedOnKitty`内の関数呼び出しを変更せよ。`feedAndMultiply`を呼び出した際に、最後に`"kitty"`パラメーターを追加せよ。




