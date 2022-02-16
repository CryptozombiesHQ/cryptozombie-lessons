---
title: Keccak256 and Typecasting
actions: ['checkAnswer', 'hints']
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              // mulai di sini
          }

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generateRandomDna(string memory _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

      }
---

Kita ingin function `_generateRandomDna` me-return (semi) random `uint`. Bagaimana kita dapat menyelesaikan ini?

Ethereum memiliki function hash `keccak256` bawaan, yang merupakan versi SHA3. Sebuah hash function pada dasarnya memetakan input ke dalam bilangan hexadecimal 256-bit secara random. Sedikit perubahan pada input akan menyebabkan perubahan besar pada hash.

Ini berguna untuk banyak tujuan di Ethereum, tetapi untuk saat ini kita hanya akan menggunakannya untuk pembuatan angka pseudo-random.

Ini juga penting, `keccak256` mengharapkan satu parameter bertipe `bytes`. Ini berarti kita harus "mengemas" parameter apapun sebelum memanggil `keccak256`:

Contoh:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("aaaab"));
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256(abi.encodePacked("aaaac"));
```

Seperti yang kamu lihat, nilai yang dikembalikan benar-benar berbeda meskipun hanya ada perubahan 1 karakter pada input.

> Catatan: Pembuatan random-number yang **Aman** di blockchain adalah masalah yang sangat sulit. Metode kita di sini tidak aman, tetapi karena keamanan bukanlah prioritas utama untuk DNA Zombie kita, ini akan cukup baik untuk tujuan kita.

## Pengetikan

Terkadang kita perlu mengonversi antar tipe data. Ambil contoh berikut:

```
uint8 a = 5;
uint b = 6;
// mengeluarkan sebuah error karena a * b return uint, bukan uint8:
uint8 c = a * b;
// kita harus mengetik b sebagai uint8 untuk membuatnya berfungsi:
uint8 c = a * uint8(b);
```

Di atas, `a * b` return `uint`, tetapi kita mencoba menyimpannya sebagai `uint8`, yang dapat menyebabkan masalah potensial. Dengan mentransmisikannya sebagai `uint8`, ini bekerja dan kompiler tidak akan mengeluarkan kesalahan.

# Kerjakan ini pada tes

Mari kita isi function `_generateRandomDna` kita! inilah yang harus dilakukan:

1. Pada baris kode pertama harus menggunakan hash `keccak256` dari `abi.encodePacked(_str)` untuk menghasilkan heksadesimal pseudo-random, ketik sebagai `uint`, dan terakhir simpan hasilnya dalam `uint` bernama `rand`.

2. Kita ingin DNA kita hanya memiliki panjang 16 digit (ingat `dnaModulus` kita?). Jadi baris kode kedua harus `return` nilai modulus (`%`) `dnaModulus` di atas.
