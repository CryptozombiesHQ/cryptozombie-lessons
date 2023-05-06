---
title: Menyatukannya
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity  >=0.5.0 <0.6.0;

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

          // mulai di sini

      }
    answer: >
      pragma solidity  >=0.5.0 <0.6.0;


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

          function createRandomZombie(string memory _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Kita hampir selesai dengan random generator Zombie! Mari kita buat public function yang menyatukan semuanya.

Kita akan membuat public function yang mengambil input, nama zombie, dan menggunakan nama tersebut untuk membuat zombie dengan random DNA.

# Kerjakan ini pada tes

1. Buat `public` function dengan nama `createRandomZombie`. Ini akan mengambil satu parameter bernama `_name` (`string` dengan lokasi data set ke `memory`). _(Catatan: Deklarasikan `public` function ini seperti kamu mendeklarasikan function sebelumnya sebagai `private` function)_

2. Baris pertama dari function harus menjalankan function `_generateRandomDna` pada `_name`, dan menyimpannya di `uint` dengan nama `randDna`.

3. Baris kedua harus menjalankan function `_createZombie` dan memasukkan `_name` dan `randDna`.

4. Solusinya harus 4 baris kode (termasuk `}` penutup function).
