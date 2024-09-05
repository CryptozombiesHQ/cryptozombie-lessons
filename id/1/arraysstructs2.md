---
title: Bekerja Dengan Structs dan Arrays
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

          function createZombie (string memory _name, uint _dna) public {
              // Mulai di sini
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

          function createZombie (string memory _name, uint _dna) public {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Membuat Structs Baru

Ingat `Person` struct kita pada contoh sebelumnya?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Sekarang kita akan belajar cara membuat `Person` baru dan menambahkannya ke array `people` kita.

```
// buat Person baru:
Person satoshi = Person(172, "Satoshi");

// Tambahkan person itu ke dalam Array:
people.push(satoshi);
```

Kami juga dapat menggabungkan ini bersama-sama dan melakukannya dalam satu baris kode untuk menjaga semuanya tetap bersih:

```
people.push(Person(16, "Vitalik"));
```

Perhatikan bahwa `array.push()` menambahkan sesuatu ke **akhir** array, jadi elemen-elemennya sesuai urutan kita menambahkannya. Lihat contoh berikut:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers sekarang sama dengan [5, 10, 15]
```

# Kerjakan ini pada tes

Mari buat fungsi createZombie kita melakukan sesuatu!

1. Isi kedalam body function sehingga tercipta `Zombie` baru, dan menambahkannya ke array `zombies`. `name` dan `dna` untuk Zombie baru harus berasal dari argumen function.
2. Mari kita lakukan dalam satu baris kode untuk menjaga semuanya tetap bersih.
