---
title: Arrays
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          // mulai di sini

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

      }
---

Saat kamu menginginkan koleksi sesuatu, kamu dapat menggunakan sebuah **_array_**. Ada dua jenis array di Solidity: **_fixed_** arrays dan **_dynamic_** arrays:

```
// fixed Array dengan panjang 2 elemen:
uint[2] fixedArray;
// fixed Array lainnya, dapat berisi 5 string:
string[5] stringArray;
// dynamic Array - tidak memiliki ukuran tetap, dapat terus bertambah:
uint[] dynamicArray;
```

Kamu juga dapat membuat sebuah array **_structs_**. Menggunakan struct `Person` pada bab sebelumnya:

```
Person[] people; // dynamic Array, kita bisa terus menambahkannya
```

Ingat bahwa state variables disimpan secara permanen di dalam blockchain? Jadi membuat sebuah dynamic array dari structs seperti ini dapat berguna untuk menyimpan data terstruktur dalam contract kamu, seperti sebuah database.

## Public Arrays

Kamu dapat mendeklarasikan array sebagai `public`, dan Solidity akan secara otomatis membuat sebuah **_getter_** method untuk itu. Sintaksnya terlihat seperti:

```
Person[] public people;
```

Contract lain kemudian dapat membaca dari, tetapi tidak menulis ke, array ini. Jadi ini adalah pola yang berguna untuk menyimpan data publik dalam contract kamu.

# Kerjakan ini pada tes

Kita ingin menyimpan pasukan zombie di aplikasi kita. Dan kita ingin memamerkan semua zombie kita ke aplikasi lain, jadi kita ingin itu menjadi publik.

1. Buat sebuah public array dari `Zombie` **_structs_**, dan beri nama `zombies`.
