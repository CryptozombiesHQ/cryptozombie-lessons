---
title: Zombie DNA
actions: ['checkAnswer', 'hints']
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
            // Začni písať tu
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

Poďme dokončiť funkciu `feedAndMultiply`.

Vzorec na výpočet DNA nového zombie je jednoduchý. Proste spočítame priemer medzi DNA kŕmiaceho sa zombie a DNA obete.

Napríklad:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ sa bude rovnať 3333333333333333
}
```

Neskôr môžme spraviť metódu výpočtu nového DNA sofistikovanejšiu, napríklad do toho zamiešať nejakú náhodnosť. Zatiaľ to však spravme jednoducho. Vždy sa k tomu môžme vrátit naspäť.

# Vyskúšaj si to sám

1. Najprv zaisti, že `_targetDna` nemá viac ako 16 cifier. To môžeš zaručiť tak, že nastavíš hodnotu `_targetDna` rovnú výrazu `_targetDna % dnaModulus`. Takýmto spôsobom nebude môcť mať viac ako 16 cifier.

2. Ďalej by naša funkcia mala deklarovať `uint` s názvom `newDna`, a nastaviť jeho hodnotu na hodnotu vypočítanú ako priemer medzi DNA `myZombie` a DNA `_targetDna` (tak ako sme to ukázali vyššie).

  > Poznámka: K jednotlivým vlasnostiam `myZombie` môžeš pristupovať takto: `myZombie.name` a `myZombie.dna`.

3. Keď už budeš mať hotové nové DNA, zavolaj `_createZombie`. Môžeš sa pozrieť na tab `zombiefactory.sol`, ak si zabudol aké parametre táto funkcia požaduje. Podotknime len, že táto funkcia požaduje meno. To v prípade nového zombie nastavíme na `"NoName"`. Neskôr môžeme dopísať funkciu na premenovanie existujúceho zombie.

> Poznámka: Pozorný zombie majstri si možno všimli v našom aktuálnom kóde problém. Bez obáv, všetko opravíme v nasledujúcej kapitole ;)
