---
title: Events
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          // deklarasikan event kita di sini

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // dan jalankan di sini
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
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string memory _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
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

Contract kita hampir selesai! Sekarang mari kita tambahkan **_event_**.

**_Events_** adalah cara contract berkomunikasi bahwa sesuatu terjadi di blockchain ke front-end aplikasimu, yang dapat 'listening' event tertentu dan mengambil tindakan saat itu terjadi.

Contoh:

```
// Deklarasikan event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public returns (uint) {
  uint result = _x + _y;
  // Jalankan event untuk memberi tahu aplikasi bahwa function-nya dipanggil:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

Front-end aplikasimu kemudian dapat listen event tersebut. Implementasi JavaScript akan terlihat seperti ini:

```
YourContract.IntegersAdded(function(error, result) {
  // lakukan sesuatu dengan result
})
```

# Kerjakan ini pada tes

Kita ingin sebuah event memberi tahu front-end kita setiap kali zombie baru dibuat, sehingga aplikasi dapat menampilkannya.

1. Deklarasikan sebuah `event` bernama `NewZombie`. Itu harus memasukkan `zombieId` (`uint`), `name` (`string`), dan `dna` (`uint`).

2. Ubah function `_createZombie` untuk menjalankan event `NewZombie` setelah menambahkan Zombie baru ke susunan array `zombies`.

3. Kamu akan membutuhkan `id` zombie. `array.push()` mengembalikan `uint` dari panjang array yang baru - dan karena item pertama dalam array memiliki index 0, `array.push() - 1` akan menjadi index zombie yang baru saja kita tambahkan. Hasil dari penyimpanan `zombies.push() - 1` di dalam `uint` disebut `id`, jadi kamu bisa menggunakan di event `NewZombie` di baris berikutnya.
