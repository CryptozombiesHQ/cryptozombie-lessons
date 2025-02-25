---
title: Operasi Matematika
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // mulai di sini

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Matematika di Solidity cukup mudah. Operasi berikut ini sama seperti kebanyakan bahasa pemrograman:

* Penambahan: `x + y`
* Pengurangan: `x - y`,
* Perkalian: `x * y`
* Pembagian: `x / y`
* Modulus / sisa: `x % y` _(misalnya, `13 % 5` adalah `3`, karena jika kamu membagi 5 kedalam 13, sisanya adalah 3)_

Solidity juga mendukung **_exponential operator_** (seperti. "x pangkat y", x^y):

```
uint x = 5 ** 2; // sama dengan 5^2 = 25
```

# Kerjakan ini pada tes

Untuk memastikan DNA Zombie kita hanya 16 karakter, mari kita buat `uint` lain sama dengan 10^16. Dengan begitu nantinya kita bisa menggunakan operator modulus `%` untuk mempersingkat sebuah integer menjadi 16 digit.

1. Buat `uint` dengan nama `dnaModulus`, dan atur sama dengan **10 pangkat `dnaDigits`**.
