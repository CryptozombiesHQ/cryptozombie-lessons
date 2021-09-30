---
title: Storage er dyrt
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
            // Start her
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

          return result;
        }

      }
---

En av de dyrere operasjonene i Solidity bruker `storage` - spesielt når du skriver til blockchain-en.

Dette skyldes at hver gang du skriver eller endrer et stykke data, skrives det permanent til blockchain-en. For alltid! Tusenvis av noder over hele verden trenger å lagre dataene på harddiskene deres, og denne mengden data fortsetter å vokse over tid som blockchain vokser. Så det er en kostnad for å gjøre det.

For å holde kostnadene nede, vil du unngå å skrive data til lagring bortsett fra når det er absolutt nødvendig. Noen ganger innebærer dette tilsynelatende ineffektiv programmeringslogikk - som ombygging av en array i `memory` hver gang en funksjon kalles i stedet for bare å lagre det arrayet i en variabel for raske oppslag.

I de fleste programmeringsspråk er en loop over store datasett dyrt. Men i Solidity er dette langt billigere enn å bruke `storage` hvis det er i en`external view`-funksjon, siden `view`-funksjoner ikke koster brukerne noen gas. (Og gas koster brukerne dine penger!).

Vi går over `for` looper i neste kapittel, men først, la oss gå over hvordan man skal erklære arrays i minnet.

## Deklarering av arrays i memory

Du kan bruke `memory`-nøkkelordet med arrays for å lage et nytt array inne i en funksjon uten å måtte skrive noe til lagring. Arrayet vil bare eksistere til slutten av funksjonsanropet, og dette er mye billigere gas-vis enn å oppdatere en array i `storage` - gratis hvis det er en`view`-funksjon som kalles eksternt.

Slik erklærer du en array i memory:

```
function getArray() external pure returns(uint[]) {
  // Start en ny array i minnet med en lengde på 3
  uint[] memory values = new uint[](3);
  // Legg til verdier
  values.push(1);
  values.push(2);
  values.push(3);
  // Returner verdier
  return values;
}
```

Dette er et trivielt eksempel bare for å vise syntaksen, men i neste kapittel ser vi på å kombinere dette med `for` loops for real-use-cases.

> Noter: Memory-arrayer **må** opprettes med et lengdeargument (i dette eksemplet, `3`). De kan for tiden ikke endres slik som storage-arrayer med `array.push ()`, selv om dette kan endres i en fremtidig versjon av Solidity.

## Test det

I vår `getZombiesByOwner`-funksjon, vil vi returnere en `uint[]` array med alle zombiene en bestemt bruker eier.

1. Erklære en `uint[] memory`-variabel kalt `result`

2. Sett den til en ny `uint`-array. Lengden på arrayet bør være like mange zombier denne `_owner`-en eier, som vi kan se opp fra vår`mapping` med: `ownerZombieCount[_owner]`.

3. På slutten av funksjonen returner `result`. Det er bare en tom array akkurat nå, men i neste kapittel fyller vi inn.
