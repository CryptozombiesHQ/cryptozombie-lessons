---
title: 別の関数とビジビリティ
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
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

            // 下の関数定義を編集せよ
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
      "zombiefeeding.sol": |
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
---

**前のレッスンのコードには間違いがあるのだ！**

コンパイルしようとしたら、エラーが出たはずだ。

`ZombieFeeding`から`_createZombie`関数を呼び出そうとした部分が問題の部分だが、`_createZombie`は`ZombieFactory`の中にある`private`関数だ。といえばわかるよな。そうだ。 `ZombieFactory`から継承したコントラクトではアクセスできないということだ。

## Internal と External

Solidityには`public` と`private`の他に、`internal` と `external`という関数用のビジビリティが用意されているのだ。

`internal`は`private`と同じだが、このコントラクトから継承したコントラクトにもアクセスできるようになる。 **(そうだ！これが我々に必要なものだ)**。

`external`は `public`と同じだが、コントラクトの外からだけ呼び出すことができるのだ。つまりコントラクト内部の別の関数では呼び出すことができないものだ。
`external` と `public`のどちらを使ったらいいのかという説明はあとでするからな。

 `internal` と `external`の関数宣言は `private` や `public`の宣言方法と同じだ：

```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // `eat`メソッドはinternalで宣言されているから呼び出すことが可能だ
    eat();
  }
}
```

# それではテストだ

1. `_createZombie()` を`private` から `internal`に変更して、他のコントラクトからアクセスできるようにせよ。

  `zombiefactory.sol`のタブを使うのだぞ。
