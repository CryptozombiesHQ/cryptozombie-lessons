---
title: Private / Public Functions
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

          Zombie[] public zombies;

          function createZombie(string memory _name, uint _dna) public {
              zombies.push(Zombie(_name, _dna));
          }

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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

Di Solidity, function bersifat `public` secara default. Ini berarti siapapun (atau contract lainnya) dapat memanggil function contract-mu dan menjalankan kodenya.

Jelas ini tidak selalu diinginkan, dan dapat membuat contractmu rentan terhadap serangan. Jadi praktik yang baik untuk menandai function-mu sebagai `private` secara default, dan kemudian hanya `public` function yang ingin kamu ekspos ke dunia.

Mari kita lihat cara mendeklarasikan private function:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```

Ini berarti hanya function lain dalam contract kita yang dapat memanggil function ini dan menambahkan ke array `numbers`.

Seperti yang kamu lihat, kita menggunakan kata kunci `private` setelah nama function. Dan seperti halnya parameter function, konvensi untuk memulai private function yaitu dengan underscore (`_`).

# Kerjakan ini pada tes

Function `createZombie` contract kita saat ini bersifat public secara default — ini berarti siapapun dapat memanggilnya dan membuat Zombie baru dalam contract kita! Mari kita buat secara private.

1. Ubah `createZombie` menjadi private function. Jangan lupa konvensi penamaan!
