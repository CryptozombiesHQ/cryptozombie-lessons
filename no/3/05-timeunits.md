---
title: Tidsenheter
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Define `cooldownTime` here

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
                // 2. Update the following line:
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
---

Egenskapen `level` er ganske selvforklarende. Senere, når vi lager et kampsystem, vil zombier som vinner flere kamper, levle opp over tid og få tilgang til flere evner.

Egenskapen `readyTime` krever litt mer forklaring. Målet er å legge til en `nedkjølingsperiode`, en tid som en zombie må vente etter fôring eller angrep før den får lov til å spise / angripe igjen. Uten dette kunne zombiem angripe og formere 1000 ganger per dag, noe som ville gjøre spillet altfor enkelt.

For å holde oversikt over hvor mye tid en zombie må vente til den kan angripe igjen, kan vi bruke Soliditys tidsenheter.

## Tidsenheter

Solidity gir noen native enheter for å håndtere tiden.

Variabelen `now` vil returnere gjeldende unix tidsstempel (antall sekunder som har gått siden 1. januar 1970). Unix-tiden i det jeg skriver dette er `1515527488`.

> Noter: Unix-tid lagres tradisjonelt i et 32-biters nummer. Dette vil funke til `År 2038` - problemet er, 32-biters unix tidsstempler vil overløpe og ødelegge mange eldre systemer. Så hvis vi ønsker at vår DApp skulle fortsette å løpe 20 år fra nå, kunne vi bruke et 64-biters nummer i stedet - men brukerne våre må bruke mer gas til å bruke vår DApp i mellomtiden. Designbeslutninger!

Solidity inneholder også tidsenhetene `seconds`, `minutes`,`hours`,`days`, `weeks` og`years`. Disse vil konvertere til en `uint` av antall sekunder i den lengden av tiden. Så `1 minutes` er `60`, `1 hours` er`3600` (60 sekunder x 60 minutter), `1 days` er `86400` (24 timer x 60 minutter x 60 sekunder) etc.

Her er et eksempel på hvordan disse tidsenhetene kan være nyttige:

```
uint lastUpdated;

// Sett `lastUpdated` til `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Vil returnere `true` hv 5 minutter har passert siden`updateTimestamp` ble 
// kalt på, `false` hvis 5 minutter ikke har passert
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Vi kan bruke disse tidsenhetene til vår Zombie `Cooldown`-funksjon.


## Test det

La oss legge til en nedkjølingstid til vår DApp, og gjør det slik at zombier må vente **1 dag** etter at de har angrepet eller spist til å angripe igjen.

1. Erklær en `uint` kalt `cooldownTime`, og sett den lik `1 days`. (Tilgi den dårlige grammatikken - hvis du setter den lik `1 day`, vil den ikke kompilere!)

2. Siden vi la en `level` og `readyTime` til vår `Zombie` struct i det forrige kapitlet, må vi oppdatere `_createZombie()` for å bruke det riktige antallet argumenter når vi lager en ny `Zombie` struct.

Oppdater `zombies.push`-koden for å legge til 2 flere argumenter:`1` (for `level`) og `uint32 (now + cooldownTime)`(for `readyTime`).

> Noter: `uint32 (...)` er nødvendig fordi `now` returnerer en `uint256` som standard. Så vi må eksplisitt konvertere den til en `uint32`.

`now + cooldownTime` vil svare til dagens unix tidsstempel (i sekunder) pluss antall sekunder på 1 dag - som vil svare til unix tidsstempel 1 dag fra nå. Senere kan vi sammenligne for å se om denne zombieens `readyTime` er større enn `now` for å se om det er nok tid til å bruke zombie igjen.

Vi implementerer funksjonaliteten for å begrense handlinger basert på `readyTime` i neste kapittel.
