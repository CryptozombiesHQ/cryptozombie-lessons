---
title: Mer om Funksjon-Visibilitet
actions: ['checkAnswer', 'hints']
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

            // endre funksjon definisjonen under
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

**Koden i vår forrige leksjon har en feil!**

Hvis du prøver å kompilere det, vil kompilatoren kaste en feil.

Problemet er at vi prøvde å kalle funksjonen `_createZombie` fra `ZombieFeeding`, men `_createZombie` er en `private`-funksjon i`ZombieFactory`. Dette betyr at ingen av kontraktene som arver fra `ZombieFactory`, kan få tilgang til den.

## Internal og External

I tillegg til `public` og `private`, kan Solidity ha to flere typer visibilitet for funksjoner: `internal` og `external`.

`internal` er det samme som `private`, med unntak av at kontrakter som arver denne funksjonen kan kjøre den. **(Hei, det høres ut som det vi vil ha her!)**.

`external` er lik som `public`, bortsett fra at disse funksjonene bare kan kalles utenfor kontrakten - de kan ikke kalles av andre funksjoner i kontrakten. Vi snakker om hvorfor du kanskje vil bruke `external` vs `public` senere.

For deklarering av `internal` eller `external` funksjoner, syntaxen er det samme som i  `private` og `public`:

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
    // Vi kan kjøre dette her fordi det er internt
    eat();
  }
}
```

# Test det

1. Endre `_createZombie()` fra `private` til `internal` så vår andre kontrakt kan få tilgang til den.

  Vi har allerede fokusert deg tilbake til den riktige tab-en, `zombiefactory.sol`.
