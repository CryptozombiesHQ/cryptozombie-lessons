---
title: Неизменяемость контрактов
actions: ['Проверить', 'Подсказать']
requireLogin: true
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

          // 1. Удали:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Измени на просто объявление:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Добавь метод setKittyContractAddress:

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

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external {
          kittyContract = KittyInterface(_address);
        }

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

До сих пор Solidity был похож на другие языки программирования, например на JavaScript. Но у Ethereum DApps есть несколько важных отличий от обычных приложений.

Первое — после развертывания на Ethereum контракта он становится **_неизменяемым_**. Это значит, что он никогда не сможет быть модифицирован или обновлен.

Первоначально развернутый в контракте код останется в блокчейне навсегда. Это одна из самых неприятных проблем с безопасностью в Solidity. Если в коде контракта есть недостаток, позже его не удастся исправить. Тебе придется убедить пользователей перейти на  исправленный адрес смарт-контракта.

Одновременно это и преимущество смарт-контрактов. Код - это закон. Если прочесть и проверить код смарт-контракта, то можно не волноваться: каждый раз при вызове функция будет делать именно то, что написано в коде. Никто не может впоследствии изменить функцию и задать ей незаявленное поведение.

## Внешние зависимости

Во втором уроке мы зашили адрес контракта Криптокотиков в DApp. Но что произойдет, если в контракте Криптокотиков обнаружится баг или кто-то уничтожит всех котиков? 

Это маловероятно, но если вдруг подобное произойдет, то наш DApp станет совершенно бесполезным - он будет указывать на адрес, который больше не возвращает котиков. Зомби не смогут питаться котятами, а мы не сможем починить контракт.

По этой причине имеет смысл предустмотреть функции, позволяющие обновлять ключевые части DApp.

Например, вместо того, чтобы зашивать адрес контракта Криптокотиков в DApp, лучше предусмотреть функцию `setKittyContractAddress` (задать адрес котоконтракта). Если в контракте Криптокотиков что-то пойдет не так, она позволит в будущем изменить адрес. 

## Проверь себя

Обновим код из Урока 2, чтобы в будущем можно было заменить адрес контракта Криптокотиков.

1. Удали строчку кода вместе с зашитым `ckAddress`.

2. Там, где мы создали `kittyContract`, измени строчку и просто объяви переменную, не задавая ее равной чему-либо.

3. Создай функцию под названием `setKittyContractAddress`. Она берет аргумент `_address` (адрес). Это должна быть внешняя функция. 

4. Внутри функции добавь строчку кода, которая устанавливает `kittyContract` равной `KittyInterface(_address)`.

> Примечание: если заметишь дыру в безопасности этой функции, не волнуйся — мы пофиксим ее в следующей главе ;) 
