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
            // start her
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

La oss fullføre `feedAndMultiply` funksjonen vår.

Formelen for å beregne en ny zombies DNA er enkel: Det er bare det gjennomsnittet mellom fôringszombieens DNA og målets DNA.

For eksempel:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ = 3333333333333333
}
```

Senere kan vi gjøre vår formel mer komplisert hvis vi vil, som å legge til litt tilfeldighet til den nye zombieens DNA. Men for nå vil vi holde det enkelt - vi kan alltid komme tilbake til det senere.

# Test det

1. Først må vi sørge for at `_targetDna` ikke er lengre enn 16 sifre. For å gjøre dette kan vi sette `_targetDna` lik `_targetDna % dnaModulus` for å bare ta de siste 16 sifrene.

2. Deretter skal vår funksjon deklarere en `uint` som heter `newDna`, og sette den lik gjennomsnittet av `myZombie`s DNA og `_targetDna` (som i eksemplet ovenfor).

  > Noter: Du kan få tilgang til egenskapene til `myZombie` ved `myZombie.name` og `myZombie.dna`

3. Når vi har det nye DNA, la oss kalle `_createZombie`. Du kan se i `zombiefactory.sol` hvis du glemmer hvilke parametere denne funksjonen trenger for å kjøre den. Legg merke til at det krever et navn, så la oss sette vår nye zombies navn til ``NoName`` for nå - vi kan skrive en funksjon for å endre zombies navn senere.

> Noter: For dere Solidity nerder, kanskje dere legger merke til et problem med vår kode her! Ikke vær redd, vi løser dette i neste kapittel;)
