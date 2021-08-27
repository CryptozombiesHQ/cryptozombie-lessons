---
title: onlyOwner Funksjon Modifisator
actions: ['checkAnswer', 'hints']
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

          KittyInterface kittyContract;

          // Modifiser denne kontrakten:
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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

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
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev Ownable kontrakten har eierens adresse, og gir grunnleggende autorisasjonskontroll over
         * funksjoner, dette forenkler implementeringen av "brukerrettigheter".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev Ownable konstruktøren setter den originale `owner`(eieren) av kontrakten som senderen
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Kaster en feil hvis det kalles av en annen konto enn eieren.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Tillater nåværende eier å overføre kontroll over kontrakten til en newOwner.
           * @param newOwner Adressen til å overføre eierskap til.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
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
---

Nå som vår basekontrakt `ZombieFactory` arver fra `Ownable`, kan vi også bruke `onlyOwner`-funksjon modifikatoren i `ZombieFeeding`.

Dette er slik kontrakt-arv fungerer, husker du:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

Dermed er `ZombieFeeding` også `Ownable`, og kan få tilgang til funksjonene / hendelsene / modifiseringene fra `Ownable`-kontrakten. Dette gjelder alle kontrakter som arver fra `ZombieFeeding` i fremtiden også.

## Funksjon modifikatorer

En funksjonsmodifikator ser ut som en funksjon, men bruker nøkkelordet `modifier` istedenfor nøkkelordet `function`. Og den kan ikke kalles direkte slik som en funksjon kan - i stedet kan vi legge ved modifikatorens navn på slutten av en funksjonsdefinisjon for å endre den funksjonens oppførsel.

La oss ta en nærmere titt på `onlyOwner`:

```
/**
 * @dev Kaster en feil hvis det kalles av en annen konto enn eieren.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

Vi vil bruke denne modifikatoren som følger:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // Noter bruk av `onlyOwner` nedenfor:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

Legg merke til `onlyOwner`-modifikatoren på `likeABoss`-funksjonen. Når du kaller `likeABoss`, kjører koden i `onlyOwner` **kjører først**. Så når den treffer `_;` i `onlyOwner`, går den tilbake og kjører koden i`likeABoss`.

Så mens det er andre måter du kan bruke modifikatorer på, er et av de vanligste brukssakene å legge til en rask `require` før en funksjon utføres.

Når det gjelder `onlyOwner`, legges denne modifiseringen til en funksjon slik at **bare eieren** av kontrakten (du, hvis du distribuerer den) kan kjøre den funksjonen.

>Noter: Å gi eieren spesielle krefter over kontrakten som dette er ofte nødvendig, men det kan også brukes skadelig. For eksempel kan eieren legge til en bakdør-funksjon som vil tillate ham å overføre noens zombier til seg selv!

> Så det er viktig å huske at bare fordi en DApp er på Ethereum, betyr ikke det automatisk at det er desentralisert. Du må faktisk lese den full kildekoden for å sørge for at det ikke er noen spesielle kontroller som eieren kan kjøre som du trenger å bekymre deg over. Det er en fin balanse som en utvikler mellom å opprettholde kontroll over en DApp slik at du kan fikse potensielle feil og å bygge en eier-løs plattform som brukerne kan stole på for å sikre dataene sine.

## Test det

Nå kan vi begrense tilgangen til `setKittyContractAddress` slik at ingen enn oss kan endre det i fremtiden.

1. Legg til `onlyOwner` modifikatoren til `setKittyContractAddress`.
