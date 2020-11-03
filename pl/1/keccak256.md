---
title: Keccak256 i rzutowanie typu
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

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

      function _generateRandomDna(string _str) private view returns (uint) {
      // start here
      }

      }
    answer: >
      pragma solidity ^0.4.25;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      }
---

Chcemy, aby funkcja `_generateRandomDna` zwracała (na wpół) losową wartość `uint`. Jak to zrealizować?

Ethereum posiada wbudowaną funkcję haszującą `keccak256`, która jest wersją SHA3. A hash function basically maps an input into a random 256-bit hexidecimal number. A slight change in the input will cause a large change in the hash.

Jest to przydatne w Ethereum z wielu powodów, ale na ten moment użyjemy tego do wygenerowania pseudo-losowej liczby.

Also important, `keccak256` expects a single parameter of type `bytes`. This means that we have to "pack" any parameters before calling `keccak256`:

Example:

    //6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
    keccak256(abi.encodePacked("aaaab"));
    //b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
    keccak256(abi.encodePacked("aaaac"));
    

As you can see, the returned values are totally different despite only a 1 character change in the input.

> Uwaga: **Bezpieczne** generowanie losowych liczb w blockchain'ie jest bardzo trudnym problemem. Zastosowana przez nas metoda nie jest bezpieczna, lecz w związku z tym, że bezpieczeństwo nie jest naszym priorytetem dla DNA Zombi, możemy pominąć kwestie z tym związane.

## Rzutowanie typu

Sometimes you need to convert between data types. Take the following example:

    uint8 a = 5;
    uint b = 6;
    // rzuca błąd, bo a * b zróci uint, a nie uint8
    uint8 c = a * b; 
    // mamy rzutowanie b jako uint8 aby to zadziałało
    uint8 c = a * uint8(b); 
    

In the above, `a * b` returns a `uint`, but we were trying to store it as a `uint8`, which could cause potential problems. By casting it as a `uint8`, it works and the compiler won't throw an error.

# Wypróbujmy zatem

Let's fill in the body of our `_generateRandomDna` function! Here's what it should do:

1. The first line of code should take the `keccak256` hash of `abi.encodePacked(_str)` to generate a pseudo-random hexadecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. Chcemy aby nasze DNA było o długości 16 cyfr (pamietasz o `dnaModulus`?). Więc druga linia powinna `zwracać` powyższą wartość modulo (`%`) `dnaModulus`.