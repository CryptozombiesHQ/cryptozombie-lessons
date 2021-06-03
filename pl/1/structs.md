---
title: Struktury
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      // start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      }
---

Czasami będziesz potrzebował bardziej złożonych typów danych. W tym celu, Solidity dostarcza nam ***strukturę (struct)***:

    struct Person {
      uint age;
      string name;
    }
    
    

Struktury pozwalają tworzyć bardziej skomplikowane typy danych, które mają wiele właściwości.

> Zauważ, że wprowadziliśmy nowy typ, `string`. Stringi sa używane do dowolnej długości danych UTF-8. Np. `string greeting = "Witaj świecie!"`

# Wypróbujmy zatem

W naszej aplikacji chcemy stworzyć jakieś Zombiaki! Będą one posiadały wiele właściwości, więc jest to idealny przypadek, aby zastosować strukturę.

1. Utwórz `strukturę` i nazwij ją `Zombie`.

2. Nasza struktura `Zombie` będzie zawierała 2 właściwości: `name` (typ `string`), i `dna` (typ `uint`).