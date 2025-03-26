---
title: Web3.js
actions: ['checkAnswer', 'hints']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

Contract Solidity kita selesai! Sekarang kita perlu menulis front-end JavaScript yang berinteraksi dengan contract.

Ethereum memiliki library JavaScript bernama **_Web3.js_**.

Di pelajaran selanjutnya, kita akan membahas secara mendalam cara menerapkan contract dan menyiapkan Web3.js Tapi untuk sekarang mari kita lihat beberapa contoh kode bagaimana Web3.js akan berinteraksi dengan contract yang kita terapkan.

Jangan khawatir jika ini belum semuanya masuk akal.

```
// Inilah cara kita mengakses contract:
var abi = /* abi dihasilkan oleh kompiler */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* alamat contract kita di Ethereum setelah deploying */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` memiliki akses ke public function dan event contract kita

// semacam event listener untuk mengambil input teks:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Panggil function `createRandomZombie` contract kita:
  ZombieFactory.createRandomZombie(name)
})

// Listen event `NewZombie`, dan perbarui UI
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// ambil dna Zombie, dan perbarui gambar kita
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // pad DNA dengan nol di depan jika kurang dari 16 karakter
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // 2 angka pertama membentuk kepala. Kita memiliki 7 kemungkinan kepala, jadi % 7
    // untuk mendapatkan angka 0 - 6, tambahkan 1 untuk menjadikannya 1 - 7. Maka kita memiliki 7
    // file gambar bernama "head1.png" melalui "head7.png" kita muat berdasarkan
    // nomor ini:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2 digit kedua membentuk mata, 11 variasi:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variasi kaos:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // 6 digit terakhir warna kontrol. Diperbarui menggunakan filter CSS: hue-rotate
    // yang memiliki 360 derajat:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Apa yang kemudian dilakukan JavaScript kita adalah mengambil nilai yang dihasilkan dalam `zombieDetails` di atas, dan menggunakan beberapa keajaiban JavaScript berbasis browser (kita menggunakan Vue.js) untuk menukar gambar dan menerapkan filter CSS. Kamu akan mendapatkan semua kode untuk ini dalam pelajaran selanjutnya.

# Cobalah!

Silakan — ketik nama kamu ke kotak di sebelah kanan, dan lihat jenis zombie yang kamu dapatkan!

**Setelah kamu memiliki zombie yang kamu sukai, lanjutkan dan klik "Bab Selanjutnya" di bawah ini untuk menyimpan zombie kamu dan menyelesaikan pelajaran 1!**
