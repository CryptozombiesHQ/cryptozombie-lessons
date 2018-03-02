---
title: Structs
actions: ['zaznacz odpowiedź', 'podpowiedź']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          // zacznij tutaj

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

      }
---

Czasami potrzebyjesz bardziej złożonego typu danych. W tym celu Solidity dostarcza **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Structs pozwalają Ci tworzyć złożone typy danych, które mają wiele właściwości

> Zauważ, że właśnie zadeklarowaliśmy nowy typ zmiennej `string`. Stringi używane są dla dowolnej długości ciągów znaków  UTF-8. Przykład: `string greeting = "Hello world!"`
 
# Zadanie do wykonania

Chcemy, aby w naszej aplikacji dało się tworzyć zombie! Każdy zombie ma wiele właściwości, idealnie więc powinny pasować strukts.

1. Stwórz `struct` o nazwie `Zombie`.

2. Struct `Zombie` będzie posiadał dwie właściwości: `name` ( `string`), oraz `dna` ( `uint`).
