---
title: Eventi
actions:
  - controllaRisposta
  - suggerimenti
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      // dichiara qui il nostro evento
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      
      struct Zombie {
      string name;
      uint dna;
      }
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      // e lancialo qui
      }
      
      function _generateRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
      }
      
      function createRandomZombie(string _name) public {
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; NewZombie(id, _name, _dna); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Il nostro contratto è quasi finito! Adesso aggiungiamo un ***evento***.

Gli ***Eventi*** sono un modo per il tuo contratto di comunicare qualcosa che succede sulla blockchain alla tua front-end app, che può essere "in ascolto" per determinati eventi e agire quando questi accadono.

Esempio:

    // dichiara un evento
    event IntegersAdded(uint x, uint y, uint result);
    
    function add(uint _x, uint _y) public {
      uint result = _x + _y;
      // lancia un evento per far sapere alla app che la funzione è stata chiamata:
      IntegersAdded(_x, _y, result);
      return result;
    }
    

La vostra app front-end potrebbe quindi ascoltare l'evento. Un implementazione javascript potrebbe quindi assomigliare a:

    YourContract.IntegersAdded(function(error, result) { 
      // do something with result
    

# Facciamo un test

Noi vogliamo un evento che faccia sapere alla nostra front-end tutte le volte che un nuovo zombie è stato creato, quindi che la app ce lo mostri.

1. Dichiara un `evento` chiamato `NewZombie`. Dovrebbe passare `zombieId` (a `uint`), `name` (a `string`), e `dna` (a `uint`).

2. Modifica la funzione `_createZombie` per lanciare l'evento `NewZombie` dopo aver aggiunto il nuovo Zombie al nostro `zombies` array.

3. Avrai bisogno degli zombie `id`. `array.push ()` restituisce un `uint` della nuova lunghezza dell'array - e poiché il primo elemento in un array ha indice 0, ` array.push () - 1` sarà l'indice dello zombie che abbiamo appena aggiunto. Memorizza il risultato di ` zombies.push () - 1 ` in un `uint` chiamato `id`, quindi puoi usarlo nell'evento `NewZombie` nella riga successiva.