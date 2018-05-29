---
title: Keccak256 i rzutowanie typu
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
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
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }
      
      function _generateRandomDna(string _str) private view returns (uint) {
      // zacznij tutaj
      }
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      }
---
Chcemy, aby funkcja `_generateRandomDna` zwracała (na wpół) losową wartość `uint`. Jak to zrealizować?

Ethereum posiada wbudowaną funkcję haszującą `keccak256`, która jest wersją SHA3. Funkcja haszująca zasadniczo odwzorowuje wejściowy ciąg znaków (string) na losową 256-bitową liczbę szesnastkową. Mała zmiana w stringu powoduje znaczną zmianę w haszu.

Jest to przydatne w Ethereum z wielu powodów, ale na ten moment użyjemy tego do wygenerowania pseudo-losowej liczby.

Przykład:

    //6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
    keccak256("aaaab");
    //b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
    keccak256("aaaac");
    

Jak widzisz, zwrócona wartość bardzo się różni, pomimo zmiany tylko jednego znaku.

> Uwaga: **Bezpieczne** generowanie losowych liczb w blockchain'ie jest bardzo trudnym problemem. Zastosowana przez nas metoda nie jest bezpieczna, lecz w związku z tym, że bezpieczeństwo nie jest naszym priorytetem dla DNA Zombie, możemy pominąć kwestie z tym związane.

## Rzutowanie typu

Czasami będziesz potrzebował przekonwertowania pomiędzy typami danych. Spójrz:

    uint8 a = 5;
    uint b = 6;
    // rzuca błąd, bo a * b zróci uint, a nie uint8
    uint8 c = a * b; 
    // mamy rzutowanie b jako uint8 aby to zadziałało
    uint8 c = a * uint8(b); 
    

W powyższym, `a * b` zwraca `uint`, a my próbowaliśmy zachować to jako `uint8`, co mogło powodować potencjalne problemy. By casting it as a `uint8`, it works and the compiler won't throw an error.

# Put it to the test

Let's fill in the body of our `_generateRandomDna` function! Here's what it should do:

1. The first line of code should take the `keccak256` hash of `_str` to generate a pseudo-random hexidecimal, typecast it as a `uint`, and finally store the result in a `uint` called `rand`.

2. We want our DNA to only be 16 digits long (remember our `dnaModulus`?). So the second line of code should `return` the above value modulus (`%`) `dnaModulus`.