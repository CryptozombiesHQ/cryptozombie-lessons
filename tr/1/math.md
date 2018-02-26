---
title: Matematiksel İşlemler
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Solidity'de matematik oldukça anlaşılırdır. Aşağıdaki işlemler çoğu programlama dilinde aynıdır:

* Toplama: `x + y`
* Çıkarma: `x - y`,
* Çarpma: `x * y`
* Bölme: `x / y`
* Modül / artan: `x % y` _(örneğin, `13 % 5`  `3`tür, çünkü 13'ü 5'e bölerseniz, kalan 3'tür)_

Solidity ayrıca bir  **_üstel operatör_** destekler (örn. "x'in y üstü", x^y):

```
uint x = 5 ** 2; //  5^2 = 25'e eşittir
```

# Teste koy
Bu yol
Zombimizin DNA'sının sadece 16 karakter olduğundan emin olmak için, 10^16'ya eşit başka bir `uint` yapalım. Böylelikle sonrada bir tamsayıyı 16 basamağa kısaltmak modulus `%` kullanabiliriz.

1. `dnaModulus` isimli bir `uint` oluştur ve **10'un `dnaDigits` üstüne** eşit ayarla.
