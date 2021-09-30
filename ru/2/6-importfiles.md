---
title: Импорт
actions: ['Проверить', 'Подсказать']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // Здесь помести оператор импорта

        contract ZombieFeeding is ZombieFactory {

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

      }

---

Зацени! Мы снесли код справа, и теперь у тебя есть вкладки в верхней части редактора. Вперед, попереключайся между вкладками, чтобы попробовать. 

Код уже довольно длинный, поэтому мы разбили его на несколько файлов, чтобы сделать его более послушным. Именно так управляют длинным кодом в проектах Solidity. 

Когда у тебя несколько файлов и нужно импортировать один в другой, Solidity использует ключевое слово `import`:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Если у нас есть файл `someothercontract.sol` в той же директории, что и этот контракт (`/` нам говорит об этом), то компилятор инпортирует его.

# Проверь себя

Теперь, когда у нас мульфайловая структура, воспользуемся `import` для чтения содержимого другого файла:

1. Импортируй `zombiefactory.sol` в новый файл `zombiefeeding.sol`. 
