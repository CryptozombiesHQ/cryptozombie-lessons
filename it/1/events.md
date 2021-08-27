---
title: Eventi
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          // dichiara qui il tuo evento

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // e utilizzalo qui
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Il nostro contratto è quasi finito! Ora aggiungiamo un **_evento_**.

**_Gli Eventi_** sono un modo per il tuo contratto di comunicare che è accaduto qualcosa sulla blockchain al front-end dell'app, che può essere in 'ascolto' per determinati eventi ed agire quando essi si verificano.

Esempio:

```
// dichiazione dell'evento
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // attiva un evento per far sapere all'app che la funzione è stata chiamata:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

Il front-end dell'app potrebbe quindi ascoltare l'evento. Un'implementazione javascript sarebbe simile a:

```
YourContract.IntegersAdded(function(error, result) { 
  // fare qualcosa con il risultato
}
```

# Facciamo una prova

Vogliamo un evento per far sapere al nostro front-end ogni volta che viene creato un nuovo zombi, in modo che l'app possa visualizzarlo.

1. Dichiaraare un `evento` chiamato `NewZombie`. Si dovrà passare `zombieId` (come `uint`), `name` (come `string`), e `dna` (come `uint`).

2. Modifica la funzione `_createZombie` per lanciare l'evento `NewZombie` dopo aver aggiunto il nuovo Zombie al nostro array `zombies`. 

3. Avrai bisogno dell'`id` dello zombi. `array.push()` restituisce un `uint` della nuova lunghezza dell'array - e poichè il primo elemento nel'array ha indice 0, `array.push() - 1` sarà l'indice dello zombie che abbiamo appena aggiunto. Memorizza il risultato di `zombies.push() - 1` in un `uint` chiamato `id`, quindi puoi usarlo nell'evento `NewZombie` nella riga successiva.
