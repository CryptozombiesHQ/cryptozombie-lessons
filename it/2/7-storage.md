---
title: Storage vs Memory (posizione dei dati)
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // inizia qui

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

            function _createZombie(string _name, uint _dna) private {
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
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

In Solidity, there are two places you can store variables — in `storage` and in `memory`.

**_Storage_** si riferisce alle variabili memorizzate in modo permanente sulla blockchain. Le variabili **_Memory_** invece sono temporanee e vengono cancellate tra le chiamate di funzioni esterne al contratto. Pensalo come il disco rigido del tuo computer rispetto alla RAM.

Il più delle volte non è necessario utilizzare queste parole chiave perché Solidity le gestisce per impostazione predefinita. Le variabili di stato (variabili dichiarate al di fuori delle funzioni) sono di default `storage` e scritte permanentemente nella blockchain, mentre le variabili dichiarate all'interno delle funzioni sono `memory` e scompaiono al termine della chiamata di funzione.

Tuttavia ci sono momenti in cui è necessario utilizzare queste parole chiave, in particolare quando si ha a che fare con **_structs_** e **_arrays_** all'interno delle funzioni:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Sembra piuttosto semplice, ma solidity ti darà un avvertimento
    // dicendoti che qui dovresti dichiarare esplicitamente `storage` o `memory`.

    // Quindi dovresti dichiarare con la parola chiave `storage`, come:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...in questo caso `mySandwich` è un puntatore a `sandwiches[_index]`
    // in memoria, e...
    mySandwich.status = "Eaten!";
    // ...questo cambierà permanentemente `sandwiches[_index]` sulla blockchain.

    // Se vuoi solo una copia, puoi usare `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...in questo caso `anotherSandwich` sarà semplicemente una copia dei 
    // dati in memoria, e...
    anotherSandwich.status = "Eaten!";
    // ...modificherà semplicemente la variabile temporanea e non avrà alcun effetto
    // su `sandwiches[_index + 1]`. Ma puoi fare così:
    sandwiches[_index + 1] = anotherSandwich;
    // ...se vuoi nuovamente copiare le modifiche sulla blockchain.
  }
}
```

Non ti preoccupare se non hai ancora capito quando e quale usare — in questo tutorial ti diremo quando usare `storage` e quando usare `memory`, e il compilatore Solidity ti darà anche avvertimenti per farti sapere quando dovresti utilizzare una di queste parole chiave.

Per ora è sufficiente capire che ci sono casi in cui dovrai dichiarare esplicitamente `storage` o `memory`!

# Facciamo una prova

È tempo di dare ai nostri zombi la capacità di nutrirsi e moltiplicarsi!

Quando uno zombi si nutre di un'altra forma di vita, il suo DNA si combinerà con il DNA dell'altra forma di vita per creare un nuovo zombi.

1. Creare una funzione chiamata `feedAndMultiply`. Ci vorranno due parametri: `_zombieId` (un `uint`) e `_targetDna` (sempre un `uint`). Questa funzione dovrebbe essere `public`.

2. Non vogliamo permettere a qualcun altro di nutrirsi usando il nostro zombi! Quindi, prima, assicuriamoci di possedere questo zombi. Aggiungi l'istruzione `request` per assicurarti che `msg.sender` sia uguale al proprietario di questo zombi (simile a come abbiamo fatto nella funzione `createRandomZombie`).

> Nota: ancora una volta, poiché il nostro controllo di risposta è primitivo, si aspetta che `msg.sender` venga prima di tutto e lo contrassegnerà come sbagliato se si cambia l'ordine. Ma normalmente quando stai programmando, puoi usare qualunque ordine tu preferisca — entrambi sono corretti.

3. Avremo bisogno di ottenere il DNA di questo zombi. Quindi la prossima cosa che la nostra funzione dovrebbe fare è dichiarare uno `Zombie` locale chiamato `myZombie` (che sarà un puntatore `storage`). Imposta questa variabile in modo che sia uguale all'indice `_zombieId` del nostro array `zombies`.

Finora dovresti avere 4 righe di codice, inclusa la riga con la chiusura `}`. 

Continueremo a implementare questa funzione nel prossimo capitolo!
