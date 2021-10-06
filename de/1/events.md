---
title: Events
actions:
  - 'checkAnswer'
  - 'hints'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      
      // declare our event here
      
      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;
      
      struct Zombie {
      string name;
      uint dna;
      }
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      // and fire it here
      }
      
      function _generatePseudoRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
      }
      
      function createPseudoRandomZombie(string _name) public {
      uint randDna = _generatePseudoRandomDna(_name);
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
      function _generatePseudoRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createPseudoRandomZombie(string _name) public { uint randDna = _generatePseudoRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Our contract is almost finished! Now let's add an ***event***.

***Events*** are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.

Example:

    // declare the event
    event IntegersAdded(uint x, uint y, uint result);
    
    function add(uint _x, uint _y) public {
      uint result = _x + _y;
      // fire an event to let the app know the function was called:
      IntegersAdded(_x, _y, result);
      return result;
    }
    

Your app front-end could then listen for the event. A JavaScript implementation would look something like:

    YourContract.IntegersAdded(function(error, result) { 
      // do something with result
    }
    

# Put it to the test

We want an event to let our front-end know every time a new zombie was created, so the app can display it.

1. Declare an `event` called `NewZombie`. It should pass `zombieId` (a `uint`), `name` (a `string`), and `dna` (a `uint`).

2. Modify the `_createZombie` function to fire the `NewZombie` event after adding the new Zombie to our `zombies` array.

3. You're going to need the zombie's `id`. `array.push()` returns a `uint` of the new length of the array - and since the first item in an array has index 0, `array.push() - 1` will be the index of the zombie we just added. Store the result of `zombies.push() - 1` in a `uint` called `id`, so you can use this in the `NewZombie` event in the next line.
