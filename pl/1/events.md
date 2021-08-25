---
title: Events (zdarzenia)
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // zadeklaruj event tutaj

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // i wywołaj go tutaj
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

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
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
---

Nasz kontrakt jest prawie gotowy! Teraz dodajmy jeszcze **_event_**.

**_Events(Zdarzenia)_** pozwalają Twojemu kontraktowi wysłać informacje do frontowej aplikacji. Frontowa aplikacja 'nasłuchuje', czy dane zdarzenie zaszło i jeśli tak jest to podejmuje stosowną akcję.

Przykład:

```
// deklaracja zdarzenia
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // wywołaj zdarzenie aby powiedzieć aplikacji, że funkcja została wywołana:
  IntegersAdded(_x, _y, result);
  return result;
}
```

Twoja aplikacja frontowa może nasłuchiwać na zdarzenia. JavaScript-owa implementacja powinna wyglądać następująco: 

```
YourContract.IntegersAdded(function(error, result) { 
  // wywałaj logikę tutaj
}
```

# Zadanie do wykonania

.
Chcemy, aby nasza frontowa aplikacja, była informowana zawsze kiedy tworzy się nowy zombie. Dzięki temu będzie mogła go wyświetlić.
1. Zadeklaruj `event` o nazwie `NewZombie`. Powinien składać się z: `zombieId` (`uint`), `name` (`string`), oraz `dna` (`uint`).

2. Zmodyfikuj funkcje `_createZombie` aby wywoływała zdarzenie `NewZombie`  po dodaniu nowego zombie do tablicy `zombies` array. 

3. Będziesz potrzebował `id` nowo stworzonego zombie. `array.push()` zwraca `uint` który jest równy długości tablicy. Jeśli założymy, że pierwszy index tablicy to  0, `array.push() - 1` będzie indexem zombie, którego właśnie dodaliśmy. Zapisz wynik `zombies.push() - 1` w `uint` o nazwie `id`, dzięki czemu będziesz mógł go użyć w zdarzeniu `NewZombie` w następnej linijce.
