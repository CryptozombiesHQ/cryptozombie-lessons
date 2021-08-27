---
title: Fonksiyon Görünürlüğünde Dahası
actions: ['cevapKontrol', 'ipuçları']
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

            // edit function definition below
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

**Önceki dersimizdeki kodda bir yanlışlık var!**

Onu derlemeyi denerseniz, derleyici bir hata verecektir.

Bu sorun `ZombieFeeding` içinden `_createZombie` fonksiyonunu çağırmayı denediğimiz fakat `_createZombie`'nin `ZombieFactory` içinde bir `private` fonksiyon olmasıdır. Bu, `ZombieFactory`'den miras kalan kontratların hiç biri ona erişemeyeceği anlamına gelir.

## Dahili ve Harici

`public` ve `private`'e ek olarak, Solidity'nin fonksiyonlar için iki görünürlük türü daha vardır: `internal` ve `external`.

Bu kontrattan kalan kontratlara da erişebilir olması dışında, `internal` `private`'e benzerdir. **(Hey, bu bizim istediğimiz şey gibi!)**.

Bu fonksiyonların SADECE kontrat dışında çağrılabilir olması dışında, `external` `public`'e benzerdir — bu kontratın içine başka fonksiyonlarla çağrılamazlar. Niçin `external` veya `public` kullanmak isteyebileceğinizden daha sonra bahsedeceğiz.

`internal` veya `external` fonksiyonlarını belirlemek için, sözdizimi `private` ve `public` ile aynıdır :

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
    // We can call this here because it's internal
    eat();
  }
}
```

# Teste koy

1. `_createZombie()`'yi `private`'den `internal`'a değiştirin böylece diğer kontratlarımız ona ulaşabilecek.

  Zaten sizi doğru sekmeye, `zombiefactory.sol`'e dönmeye odakladık.
