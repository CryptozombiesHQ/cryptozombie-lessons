---
title: For Loops
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
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
            // Start her
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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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
---

I det forrige kapittelet nevnte vi at du noen ganger vil ha bruk for en `for` loop for å bygge innholdet i en array i en funksjon i stedet for å bare lagre det arrayen til lagring.

La oss se på hvorfor.

For vår `getZombiesByOwner`-funksjon vil en naiv implementering være å lagre en `mapping` av eiere til zombie-hærer i `ZombieFactory`-kontrakten:

```
mapping (address => uint[]) public ownerToZombies
```

Så hver gang vi lager en ny zombie, ville vi bare bruke `ownerToZombies[owner].push(zombieId)` for å legge den til den eierens zombie-array. Og `getZombiesByOwner` ville være en veldig enkel funksjon:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### Problemet med denne metoden

Denne tilnærmingen er fristende for sin enkelhet. Men la oss se på hva som skjer hvis vi senere legger til en funksjon for å overføre en zombie fra en eier til en annen (som vi definitivt vil legge til i en senere leksjon!).

Denne overføringsfunksjonen vil trenge:
1. Skyv zombie til den nye eierens `ownerToZombies`-array,
2. Fjern zombie fra den gamle eierens `ownerToZombies`-array,
3. Skift hver zombie i den eldre eierens array opp ett sted for å fylle hullet, og deretter
4. Reduser array lengden med 1.

Trinn 3 ville være ekstremt dyrt gassvis, siden vi måtte skrive for hver zombie hvis posisjon vi skiftet. Hvis en eier har 20 zombier og handler bort den første, må vi gjøre 19 skriver for å opprettholde rekkefølgen på matrisen.

Siden skriving til storage er en av de dyreste operasjonene i Solidity, vil alle anrop til denne overføringsfunksjonen være ekstremt dyr gasvis. Og enda verre, det ville koste en ny mengde gas hver gang den kjører, avhengig av hvor mange zombier brukeren har i sin hær og indeksen for zombier som blir kjøpt/solgt. Så brukeren ville ikke vite hvor mye gass å sende.

> Noter: Selvfølgelig kunne vi bare flytte den siste zombieen i arrayet for å fylle den manglende sporet og redusere array lengden med en. Men da ville vi endre rekkefølgen til vår zombie hær hver gang vi lagde en handel.

Siden `view` -funksjonene ikke koster gass når de kalles eksternt, kan vi bare bruke en for-loop i `getZombiesByOwner` for å iterere hele zombiesystemet og bygge en rekke zombier som tilhører denne bestemte eieren. Da blir vår `transfer`-funksjon mye billigere, siden vi ikke trenger å ombestille noen arrays i lagring, og noe motintuitivt er denne tilnærmingen billigere generelt.

## Bruk av `for`-loops

Syntaxen for `for`-loops i Solidity ligner på JavaScript.

La oss se på et eksempel der vi vil lage en rekke likeverdige tall:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // Hold oversikt over indeksen i den nye arrayen:
  uint counter = 0;
  // Iterter 1 til 10 med en for loop:
  for (uint i = 1; i <= 10; i++) {
    // If `i` er et jevnt tall...
    if (i % 2 == 0) {
      // Legg til i array
      evens[counter] = i;
      // øk counter til jevnt tall:
      counter++;
    }
  }
  return evens;
}
```

Denne funksjonen returnerer en array med innholdet `[2, 4, 6, 8, 10]`.

## Test det

La oss fullføre vår `getZombiesByOwner`-funksjon ved å skrive en `for`-loop som gjengir seg gjennom alle zombiene i vår DApp, sammenligner eieren deres for å se om vi har en kamp, og skyver dem til `result`-arrayen vår før de returneres.

1. Erklær en `uint` som heter `counter` og sett den lik `0`. Vi bruker denne variabelen til å holde oversikt over indeksen i vår `result`-array.

2. Erklær en `for` loop som starter fra `uint i = 0` og går opp gjennom `i < zombies.length`. Dette vil iterere over hver zombie i arrayen vår.

3. Inn i `for`-loopen, lag en `if`-setning som kontrollerer om `zombieToOwner[i]` er lik `_owner`. Dette vil sammenligne de to adressene for å se om vi har en kamp.

4. Inne i `if`-setningen:
    1. Legg zombieens ID til `result`-arrayen vår ved å sette `result[counter]` lik `i`.
    2. Øk `counter` med 1 (se `for` loop eksempel ovenfor).

Det var det - funksjonen vil nå returnere alle zombiene eid av `_owner` uten å bruke noe gas.
