---
title: "Bonus: Geni del Gattino"
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Modifica la definizione della funzione qui:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Aggiungi una condizione if qui
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // E modifica la chiamata di funzione qui:
            feedAndMultiply(_zombieId, kittyDna);
          }

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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

La nostra logica delle funzioni è ora completa ... ma aggiungiamo una funzione bonus.

Facciamo in modo che gli zombi fatti con i gattini abbiano alcune caratteristiche uniche che dimostrano di essere un vero gatto-zombi.

Per fare questo, possiamo aggiungere un codice speciale del gattino nel DNA dello zombi.

Se ricordi, dalla lezione 1 attualmente stiamo usando solo le prime 12 cifre del nostro DNA a 16 cifre per determinare l'aspetto dello zombi. Quindi usiamo le ultime 2 cifre, non utilizzate, per gestire caratteristiche "speciali". 

Diremo che i gatti-zombie hanno `99` come ultime due cifre del DNA (poiché i gatti hanno 9 vite). Quindi nel nostro codice, diremo `se` uno zombi proviene da un gatto, imposteremo le ultime due cifre del DNA su `99`.

## Istruzione If

Le istruzioni If in Solidity sembrano proprio come in JavaScript:

```
function eatBLT(string sandwich) public {
  // Ricorda, con le stringhe dobbiamo confrontare i loro hash keccak256
  // per verificarne l'uguaglianza
  if (keccak256(abi.encodePacked(sandwich)) == keccak256(abi.encodePacked("BLT"))) {
    eat();
  }
}
```

# Facciamo una prova

Implementiamo i geni dei gatti nel nostro codice zombi.

1. Innanzitutto cambiamo la definizione della funzione `feedAndMultiply` in modo da prendere un terzo argomento: una `string` chiamata `_species`

2. Successivamente, dopo aver calcolato il DNA del nuovo zombi, aggiungiamo un'istruzione `if` confrontando gli hash `keccak256` di `_species` e la stringa `"kitty"`. Non possiamo passare direttamente le stringhe a `keccak256`. Invece passeremo `abi.encodePacked(_species)` come argomento sul lato sinistro e `abi.encodePacked("kitty")` come argomento sul lato destro.

3. All'interno dell'istruzione `if` vogliamo sostituire le ultime 2 cifre del DNA con `99`. Un modo per farlo è usare la logica: `newDna = newDna - newDna % 100 + 99;`.

> Spiegazione: Supponiamo che `newDna` sia `334455`. Quindi `newDna % 100` è `55`, quindi `newDna - newDna % 100` è `334400`. Infine aggiungi `99` per ottenere `334499`.

4. Infine dobbiamo cambiare la chiamata di funzione all'interno di `feedOnKitty`. Quando si chiama `feedAndMultiply` aggiungere il parametro `"kitty"` alla fine.
