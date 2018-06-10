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

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
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
Let's finish writing the `feedAndMultiply` function.

Vzorec na výpočet DNA nového zombie je jednoduchý: Proste spočítame priemer medzi DNA kŕmiaceho sa zombie a DNA jeho obete.
The formula for calculating a new zombie's DNA is simple: It's simply that average between the feeding zombie's DNA and the target's DNA. 

Napríklad:
For example:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ sa bude rovnať 3333333333333333
}
```

Neskôr môžme spraviť metódu výpočtu nového DNA sofistikovanejšiu, napríklad do toho zamiešať nejakú náhodnosť. Zatial to však spravme jednoducho - vždy sa k tomu môžme ešte vrátit. 
Later we can make our formula more complicated if we want to, like adding some randomness to the new zombie's DNA. But for now we'll keep it simple — we can always come back to it later.

# Vyskúšaj si to sám
# Put it to the test

1. Najprv sa musíš uistiť že `_targetDna` nemá viac ako 16 cifier. To môžeš zaručiť tak že nastavíš hodnotu `_targetDna` nech sa rovná výrazu `_targetDna % dnaModulus`. Takýmto spôsobom nebude môcť mať viac ako 16 cifier.
1. First we need to make sure that `_targetDna` isn't longer than 16 digits. To do this, we can set `_targetDna` equal to `_targetDna % dnaModulus` to only take the last 16 digits.

2. Ďalej naša funkcia by mala deklarovať `uint` s názvom `newDna` a nastaviť ho na hodnotu vypočítanú ako priemer DNA `myZombie` s DNA `_targetDna` (tak ako sme to ukázali vyššie).
2. Next our function should declare a `uint` named `newDna`, and set it equal to the average of `myZombie`'s DNA and `_targetDna` (as in the example above).

  > Poznámka: K jednotlivým vlasnostiam `myZombie` môžeš pristupovať takto: `myZombie.name` a `myZombie.dna`.

3. Keď už budeš mať hotové nové DNA, zavolaj `_createZombie`. Môžeš sa pozrieť na tab `zombiefactory.sol` ak si zabudol aké paramtre táto funkcia požaduje. Podotknime že táto funkcia požaduje meno, takže zatiaľ nastavíme meno našeho nového zombie na `"NoName"` - môžeme neskôr napísať funkciu na premenovanie existujúceho zombie.
3. Once we have the new DNA, let's call `_createZombie`. You can look at the `zombiefactory.sol` tab if you forget which parameters this function needs to call it. Note that it requires a name, so let's set our new zombie's name to `"NoName"` for now — we can write a function to change zombies' names later.

> Poznámka: Solidity borci si možno všimli v našom aktuálnom kóde istý problém. Nemajte obovy, všetko opravíme v nasledujúcej kapitole ;)
> Note: For you Solidity whizzes, you may notice a problem with our code here! Don't worry, we'll fix this in the next chapter ;)
