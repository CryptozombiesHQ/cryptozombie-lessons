---
title: "Contracts"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Create contract here
    answer: > 
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

      }
---

Dimulai dengan dasar-dasar absolut:

Kode Solidity dikemas dalam sebuah **contract**. Sebuah `contract` adalah blok bangunan fundamental dari aplikasi Ethereum — semua variabel dan function termasuk dalam contract, dan ini akan menjadi titik awal dari semua proyek kamu.

Sebuah contract kosong bernama `HelloWorld` akan terlihat seperti ini:

```
contract HelloWorld {

}
```

## Version Pragma

Semua kode sumber solidity harus dimulai dengan "version pragma" — sebuah deklarasi versi kompiler Solidity yang harus digunakan kode ini. Ini untuk mencegah masalah dengan versi kompiler masa depan yang berpotensi memperkenalkan perubahan yang akan merusak kode kamu.

Untuk cakupan tutorial ini, kami ingin dapat mengkompilasi smart contract kami dengan versi kompiler apapun dalam kisaran 0.5.0 (inklusif) hingga 0.6.0 (eksklusif).
Ini terlihat seperti: `pragma solidity >=0.5.0 <0.6.0;`.

Jika digabungkan, berikut adalah contract awal sederhana — hal pertama yang akan kamu tulis setiap kali memulai proyek baru:

```
pragma solidity >=0.5.0 <0.6.0;

contract HelloWorld {

}
```

# Kerjakan ini pada tes

Untuk mulai membuat pasukan Zombie, mari buat contract dasar bernama `ZombieFactory`.

1. Di kotak sebelah kanan, buat agar contract kita menggunakan versi solidity `>=0.5.0 <0.6.0`.

2. Buat contract kosong bernama `ZombieFactory`.

Setelah selesai, klik "periksa jawaban" dibawah. Jika kamu kehabisan ide/stuck, kamu dapat mengklik "petunjuk".
