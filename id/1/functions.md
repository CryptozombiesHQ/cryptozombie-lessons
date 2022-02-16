---
title: Deklarasi Function
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

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

Deklarasi sebuah function dalam solidity terlihat seperti berikut:

```
function eatHamburgers(string memory _name, uint _amount) public {

}
```

Ini adalah function bernama `eatHamburgers` yang mengambil 2 parameter: `string` dan `uint`. Untuk saat ini body function masih kosong. Perhatikan bahwa kita menetapkan visibilitas function sebagai `public`. Kita juga memberikan instruksi tentang dimana variabel `_name` harus disimpan di dalam `memory`. Ini diperlukan untuk semua tipe referensi seperti array, struct, mapping, dan string.

Apa referensi yang ingin kamu tanyakan?

Nah, ada dua cara dimana kamu bisa meneruskan argumen ke function Solidity:

 * Berdasarkan value, yang berarti bahwa kompiler solidity membuat salinan baru dari nilai parameter dan meneruskannya ke function. Ini memungkinkan function untuk mengubah nilai tanpa khawatir bahwa nilai parameter awal akan berubah.
 * Berdasarkan reference, yang berarti bahwa function akan dipanggil dengan... reference ke variabel asli. Jadi, jika function mengubah nilai variabel yang diterimanya, nilai variabel asli akan berubah.


> Catatan: Ini adalah konvensi (tetapi tidak wajib) untuk memulai nama variabel paramater function dengan garis bawah (`_`) untuk membedakannya dari variabel global. Kita akan menggunakan konvensi tersebut di sepanjang tutorial.

Kamu akan memanggil function seperti ini:

```
eatHamburgers("vitalik", 100);
```

# Kerjakan ini pada tes

Di aplikasi kita, kita harus dapat membuat beberapa zombie. Mari kita buat function tersebut.

1. Buat `public` function bernama `createZombie`. Ini harus mengambil dua parameter: **\_name** (`string`), dan **\_dna** (`uint`). Jangan lupa untuk memasukkan argumen pertama berdasarkan nilai dengan menggunakan kata kunci `memory`.

Biarkan body kosong untuk saat ini — kita akan mengisinya nanti.
