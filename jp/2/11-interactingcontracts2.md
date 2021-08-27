---
title: Interfaceを使用する
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
          // `ckAddress`を使用してkittyContractをここで初期化せよ。

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

      }
---

前の例を`NumberInterface`を使って、interfaceを次のように定義するぞ：

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

これをコントラクト内で使用できるぞ。次のように使えばいい：

```
contract MyContract {
  address NumberInterfaceAddress = 0xab38...; 
  // ここは、イーサリアム上のFavoriteNumberコントラクトのアドレスが入る。
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
  // `numberContract`は他のコントラクトを指し示すものになっているぞ 

  function someFunction() public {
    // コントラクトから`getNum`を呼び出せるぞ：
    uint num = numberContract.getNum(msg.sender);
    // ...よし、`num`を操作するぞ。
  }
}
```

こうすれば、イーサリアムブロックチェーン上で他のコントラクトとやりとりできることがわかっただろう。ただし 関数が`public` や `external`である場合に限ることを忘れるなよ。


# それではテストだ

クリプトキティーズのスマートコントラクトを読み込むための設定をコントラクトに加えよ！

1. 君のコード中にクリプトキティーズのコントラクトのアドレスを保存しておいた。`ckAddress`という名前の変数に格納されている。次の行では、 `kittyContract`という名前の`KittyInterface`を作成し、`ckAddress`を使用して初期化せよ。やり方は`numberContract`で実施したのと同じ方法を取ればよい。

