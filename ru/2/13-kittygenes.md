---
title: "Бонус: гены котика"
actions: ['Проверить', 'Подсказать']
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

          // Здесь измени значение функции:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // А здесь добавь оператор «если»: 
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // Здесь измени вызов функции:
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

Мы закончили с логикой функции... но давай добавим небольшую бонусную фишку. 

Сделаем так, чтобы зомби, полученные из котиков, обладали уникальной характеристику, показывающей, что они именно зомбокотики.

Для этого добавим специальный котиковый код в ДНК зомби. 

Если помнишь, в первом уроке мы использовали только первые 12 цифр из 16-циферного ДНК, чтобы определить внешний вид зомби. Поэтому давай возьмем последние 2 цифры из неиспользованных, чтобы разобраться со «специальными» характеристиками. 

Допустим, последние две цифры ДНК зомбокотика `99` (ведь известно, что у кошки 9 жизней). В нашем коде, `if` (если) зомби происходит от котика, то последние две цифры в ДНК мы установим как `99`.

## Оператор «если»

Оператор «если» в Solidity похож на JavaScript:

```
function eatBLT(string sandwich) public {
  // Не забудь, что в строках надо сравнивать keccak256-хэши,
  // чтобы проверить, равны они или нет.
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# Проверь себя

Введем ген котика в наш зомби-код

1. Сначала давай изменим определение функции на `feedAndMultiply` (питаться и размножаться), чтобы она брала третий аргумент: `string` (строку) под названием `_species` (виды).

2. Когда мы вычислили ДНК нового зомби, добавим оператор `if` (если), чтобы он сравнил `keccak256` хэши строк `_species` (виды) и `"kitty"` (котик).

3. Внутри оператора `if` (если) мы хотим заменить последние 2 цифры ДНК на `99`. Один из способов сделать это — использовать логику `newDna = newDna - newDna % 100 + 99;`.

  > Объяснение: предположим, `newDna` равна `334455`. Тогда `newDna % 100` равна `55`, поэтому `newDna - newDna % 100` это `334400`. В конце добавим `99` чтобы получить `334499`.

4. И последнее, нам надо заменить функцию внутри `feedOnKitty`. Когда она вызывает `feedAndMultiply`, добавь в конец параметр `"kitty"`.
