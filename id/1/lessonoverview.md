---
title: Ringkasan Pelajaran
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Di Pelajaran 1, kamu akan membangun "Pabrik Zombie" untuk membangun pasukan zombie.

* Pabrik kita akan memelihara database semua zombie di pasukan kita
* Pabrik kita akan memiliki function untuk membuat zombie baru
* Setiap zombie akan memiliki penampilan acak dan unik

Di pelajaran selanjutnya, kita akan menambahkan lebih banyak function, seperti memberi zombie kemampuan untuk menyerang manusia atau zombie lainnya! Tetapi sebelum kita sampai disana, kita harus menambahkan fungsionalitas dasar untuk membuat zombie baru.

## Bagaimana DNA Zombie Bekerja

Penampilan zombie akan didasarkan pada "DNA Zombie"-nya. DNA Zombie sederhana — ini hanya 16-digit integer, seperti:

```
8356281049284737
```

Sama seperti DNA asli, bagian yang berbeda dari nomor ini akan dipetakan ke sifat yang berbeda. 2 digit pertama dipetakan ke tipe kepala zombie, 2 digit kedua ke mata zombie, dll.

> Catatan: Untuk tutorial ini, kita membuat semuanya tetap sederhana, dan zombie kita hanya dapat memiliki 7 jenis kepala yang berbeda (walaupun 2 digit memungkinkan 100 opsi yang memungkinkan). Nanti kita bisa menambahkan lebih banyak tipe kepala jika kita ingin menambah jumlah variasi zombie.

Misalnya, 2 digit pertama dari contoh DNA kita di atas adalah `83`. Untuk memetakannya ke tipe kepala zombie, kita lakukan `83 % 7 + 1` = 7. Jadi Zombie ini akan memiliki tipe kepala zombie ke-7. 

Di panel sebelah kanan, lanjutkan dan pindahkan penggeser `head gene` ke kepala ke-7 (Topi Santa) untuk melihat sifat apa yang sesuai dengan `83`.

# Kerjakan ini pada tes

1. Mainkan dengan penggeser di sisi kanan halaman. Percobaan untuk melihat bagaimana nilai numerik yang berbeda sesuai dengan aspek yang berbeda dari penampilan zombie.

Oke, cukup bermain-main. Saat kamu siap untuk melanjutkan, tekan "Bab Berikutnya" di bawah, dan mari selami mempelajari Solidity"
