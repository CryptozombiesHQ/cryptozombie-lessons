---
title: Случайные числа
actions: ['Проверить', 'Подсказать']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombieattack.sol": |
        pragma solidity ^0.4.19;

        import "./zombiehelper.sol";

        contract ZombieBattle is ZombieHelper {
          // Начало здесь
        }
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function withdraw() external onlyOwner {
            owner.transfer(this.balance);
          }

          function setLevelUpFee(uint _fee) external onlyOwner {
            levelUpFee = _fee;
          }

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiehelper.sol";

      contract ZombieBattle is ZombieHelper {
        uint randNonce = 0;

        function randMod(uint _modulus) internal returns(uint) {
          randNonce++;
          return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
        }
      }

---

Отлично! Теперь разберемся с логикой битвы.

Все хорошие игры требуют некоего элемента случайности. Как в Solidity генерировать случайные числа?

Правильный ответ — НИКАК. Нет способа делать это безопасно.

И вот почему.

## Генерация случайных чисел через `keccak256`

Лучший способ создать источник случайностей в Solidity — хэш-функция `keccak256`.

Можно написать код вроде такого:

```
// Сгенерировать случайное число от 1 до 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```

Эта функция берет временную метку `now`, `msg.sender` и добавочный `nonce` (nonce - число, используемое только один раз, поэтому не запускают дважды хэш-функцию с одним и тем же наборов входных данных).

Затем она использует `keccak` для преобразования входных данных в случайный хэш, конвертирует этот хэш в `uint`, далее выполняет `%100`, чтобы взять только последние 2 цифры. Эта процедура дает нам абсолютно случайное число от 0 до 100.

### Этот метод уязвим перед типом атаки, известным как «нечестная нода»

Когда ты вызываешь функцию в контракте Ethereum, то транслируешь ее ноде или нодам в сети как **_транзакцию_**. Ноды в сети собирают много транзакций вместе и стараются первыми найти решение сложной математической задачи, чтобы получить «Доказательство работы». Затем они публикуют в сети эту группу транзакций и доказательство работы (PoW) как **_блок_**.

Как только нода решила задачу и получила PoW, другие ноды перестают решать эту задачу, проверяют валидность списка транзакций решившей ноды, принимают блок и включают его в блокчейн. Затем приступают к поиску решения задачи для следующего блока.

**Теоретически из-за этого функцию случайных чисел можно взломать.**

Представим, что существует контракт игры типа «орел-решка» - если выпадает орел, то активы удваиваются, если выпадает решка, то игрок теряет все. Предположим, что функция определяет выпадение орла и решки. (`random >= 50` - орел, `random <50` - решка).

Если человек держит ноду, то он может опубликовать транзакцию **только в своей собственной ноде** и не делиться ей ни с кем. Он может запустить функцию подбрасывания монеты, чтобы увидеть результат — орел или решка — и не включать транзакцию в следующий блок при проигрыше. Можно продолжать делать это бесконечно, пока не выпадет нужная сторона монеты, и эту транзакцию уже включить в следующий блок — профит!

## Как же решить проблему безопасной генерации случайных чисел в Ethereum?

Поскольку содержимое блокчейна видно всем участникам, это нелегкая задача, и ее решение выходит за рамки данного руководства. Для вдохновения почитай тему на StackOverflow <a href="https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract" target=_new></a>. Одна из идей — использовать **_оракул_** для доступа к функции генерации случайных чисел извне блокчейна Ethereum.

Разумеется, в условиях десятков тысяч конкурирующих за блок нод в сети Ethereum, шансы на нахождение ответа следующего блока крайне низки. Нужно много времени и вычислительных ресурсов, чтобы воспользоваться уязвимостью - но если вознаграждение было бы достаточно высоким (например, если можно выиграть 100 000 000 долларов в орел-решку), то атаковать целесообразно.

Таким образом генерация случайных чисел в Ethereum НЕ безопасна. На практике, если наша случайная функция не обещает очень больших денег, то у пользователей игры не хватит ресурсов для атаки.

На этом курсе мы пишем простую игру в демонстрационных целях и в ней не задействованы реальные деньги. Поэтому используем простой в реализации генератор случайных чисел, отдавая себе отчет, что он не полностью безопасен.

## Проверь себя

Внедрим функцию, которая с помощью случайных чисел будет определять результат битвы. К сожалению, она не будет защищена от атак полностью.

1. Задай в контракте `uint` под названием `randNonce` и установи его равным `0`.

2. Создай функцию под названием `randMod` (случайный модуль). Это будет `internal` функция, которая берет `uint` с именем `_modulus` и возвращает `uint`.

3. Сначала функция выполняет `randNonce` (используя синтаксис `randNonce++`).

4. Наконец, функция одной строчкой кода вычисляет тип `uint` хэша `keccak256` от `now`, `msg.sender` и `randNonce` - и возвращает (`return`) значение `% _modulus`. (Вау, это было сложно выговорить. Если тебе не удалось уследить за мыслью, просто посмотри пример вычисления случайного числа выше - логика очень похожа).
