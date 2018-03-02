---
title: Prywatne / Publiczne Funkcje
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

W Solidity, funkcje są domyślnie publiczne (`public`). To oznacza, że każdy (nawet inny kontrakt) może wywołać funkcje z twojego kontraktu i  w ten sposób wykonać jej kod.

Oczywiście nie zawsze takie zachowanie jest pożądane, szczególnie może to doprowadzić do hakerskich ataków na Twój kontrakt. Z tego powodu dobrą praktyką jest pisanie funkcji jako `private` domyslnie. Jesli później okaże się, że funkcja powinna być publiczna `public`, wtedy możemy ją zmienić, tak aby była dostępna dla całego świata.

Zobaczmy jak się deklaruje prywatne `private` funkcje:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```

To oznacza, że tylko funkcje z naszego kontraktu bedą mogły wywołać tą funkcje i dodać element do tablicy `numbers`

Zauważ, że użyliśmy słówka kluczowego `private` zaraz po nazwie funkcji. Tak samo jak w przypadku parametrów funkcji, istnieje konwencja która mówi, aby nazwy prywatnych funkcji zaczynały się od podkreślnika (`_`).

# Zadanie do wykonania

Funkcja `createZombie` naszego kontraktu jest aktualnie publiczna — to oznacza, że każdy może ją wywołać i stworzyć nowego zombie w naszym kontrakcie! Zróbmy z niej funkcje prywatną.

1. Zmień `createZombie` na przywatną funkcje. Nie zapomnij o naszej konwencji związanej z nazwami funkcji!
