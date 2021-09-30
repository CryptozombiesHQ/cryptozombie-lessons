---
title: 複数の返り値の処理
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

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

          // ここに関数を定義せよ

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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna);
        }

      }
---

複数の値を返す最初の例として、`getKitty`関数を使って教えていくぞ。どのように処理するのか見せるから、よく読むように：

```
function multipleReturns() internal returns(uint a, uint b, uint c) {
  return (1, 2, 3);
}

function processMultipleReturns() external {
  uint a;
  uint b;
  uint c;
  // これが複数に割り当てる方法だ：
  (a, b, c) = multipleReturns();
}

// そのうちの一つの値だけ欲しければ、こうすれば良い：
function getLastReturnValue() external {
  uint c;
  // 他のフィールドは空欄でも構わないぞ：
  (,,c) = multipleReturns();
}
```

# それではテストだ

それでは、クリプトキティーズのコントラクトとやり取りを開始させるのだ！

コントラクトからkittyのgenesを取得するための関数を作成せよ：

1. `feedOnKitty`という名前の関数を作成せよ。そこに `_zombieId` と`_kittyId`というどちらも `uint`のパラメーターを設定せよ。また関数は `public`を使用せよ。

2. その関数の中で、まず最初に`kittyDna`という`uint` の関数を宣言せよ。

  > 注: `KittyInterface`と`genes` は、`uint256`です。ただし、レッスン1で解説した通り `uint`は`uint256`のエイリアスのため、両者は同じことを意味しています。

3. 次に `_kittyId`で、`kittyContract.getKitty`関数を呼び出し、`kittyDna`に `genes` を格納せよ。一つ注意点がある - `getKitty`を使うと、大量の変数が返ることになる(正確には10個だ — ここまで教えてやっているのだから、失敗するなよ)。欲しいのは最後の`genes`だけだ。カンマの数に気をつけるのだぞ！

4. 最後に、`feedAndMultiply`を呼び出し、`_zombieId` と `kittyDna`の両方を渡すのだ。


