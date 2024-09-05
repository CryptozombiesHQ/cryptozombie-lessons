---
title: Lebih lanjut tentang Function
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

          function _createZombie(string memory _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generateRandomDna(string memory _str) private view returns (uint) {

          }

      }
---

Dalam bab ini, kita akan belajar tentang **_return values_** function, dan function modifier.

## Return Values

Untuk mengembalikan value dari sebuah function, deklarasi terlihat seperti ini:

```
string greeting = "What's up dog";

function sayHello() public returns (string memory) {
  return greeting;
}
```

Di Solidity, deklarasi function berisi jenis value yang dikembalikan (dalam hal ini `string`).

## Function modifier

Function di atas sebenarnya tidak mengubah state dalam Solidity — mis. ini tidak mengubah nilai apapun atau menulis apapun.

Jadi dalam hal ini kita dapat mendeklarasikannya sebagai sebuah **_view_** function, yang artinya hanya melihat data tetapi tidak mengubahnya:

```
function sayHello() public view returns (string memory) {
```

Solidity juga berisi **_pure_** function, yang berarti kamu bahkan tidak mengakses data apapun di aplikasi. Pertimbangkan hal berikut:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Function ini bahkan tidak membaca dari state aplikasi — nilai kembaliannya hanya bergantung pada parameter function-nya. Jadi dalam hal ini kita akan mendeklarasikan sebagai **_pure_** function.

> Catatan: Mungkin sulit untuk mengingat kapan harus menandai function sebagai pure/view. Untungnya Solidity pandai mengeluarkan peringatan untuk memberi tahu kamu kapan kamu harus menggunakan salah satu modifier ini.

# Kerjakan ini pada tes

Kita akan menginginkan helper function yang menghasilkan nomor DNA acak dari sebuah string.

1. Buat sebuah `private` function bernama `_generateRandomDna`. Ini akan mengambil satu parameter bernama `_str` (`string`), dan return sebuah `uint`. Jangan lupa untuk mengatur lokasi data parameter `_str` ke `memory`.

2. Function ini akan melihat beberapa variabel contract kita tetapi tidak mengubahnya, jadi tandai sebagai `view`.

3. Body function harus kosong pada saat ini — kita akan mengisinya nanti.
