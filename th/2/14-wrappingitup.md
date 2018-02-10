---
title: ขมวดปมบทที่ 2
actions: ['checkAnswer', 'hints']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

เพียงเท่านี้ก็สำเร็จบทที่ 2 ได้แล้ว!

สามารถเข้าไปดูตัวอย่าง demo ได้ทางด้านขวา เรารู้ว่าคุณคงรอแทบไม่ไหวที่จะเลื่อนไปด้านล่างของบทเรียน 😉 คลิกที่น้องแมวเพื่อให้ซอมบี้เข้าจู่โจม และมาดูกันว่าจะได้รับ kitty zombie หน้าตาอย่างไรกัน!

## การอิมพลีเมนท์ Javascript 

เนื่องจากตอนนี้ contract ได้พร้อมแล้วที่จะปรับใช้บน Ethereum เราจะมาคอมไพล์และใช้ฟังก์ชั่น `ZombieFeeding` กัน— เนื่องจาก contract นี้มีการ inherit  มาจาก `ZombieFactory` ทำให้สามารถเข้าถึง method ของทั้ง 2 contract ที่เป็น public ได้

มาดูตัวอย่างของการ interact กับ contract ของเราโดยการใช้Javascript และ web3.js กันดีกว่า:

```
var abi = /* abi สร้างโดย compiler */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* ส่วนนี้คือ address ของ contract หลังจากที่นำมาปรับใช้บน Ethereum  */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// สมมติว่าเรามี ID ของซอมบี้และ ID ของ kitty ที่เราต้องการที่จะจู่โจมแล้ว
let zombieId = 1;
let kittyId = 1;

// To get the CryptoKitty's image, we need to query their web API. This
// information isn't stored on the blockchain, just their webserver.
// If everything was stored on a blockchain, we wouldn't have to worry
// about the server going down, them changing their API, or the company 
// blocking us from loading their assets if they don't like our zombie game ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // เพื่อให้แสดงรูปภาพออกมา
})

// เมื่อผู้ใช้ทำการคลิกที่ตัว kitty:
$(".kittyImage").click(function(e) {
  // เรียกใช้ method `feedOnKitty` ของ contract
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// สำหรับการรับฟัง (listen) อีเว้นท์ NewZombie ที่จะมาจาก contract ของเรา เพื่อจะสามารถแสดงมันออกมาได้:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // ฟังก์ชั่นนี้จะใช้ในการแสดงซอมบี้ เหมือนในบทเรียนที่ 1 :
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# มาลองเล่นกัน!

เลือกน้องแมวตัวที่เราต้องการให้ซอมบี้กิน และ  DNA ของซอมบี้และ kitty จะรวมเข้าด้วยกันท ำให้คุณได้รับซอมบี้ตัวใหม่ในกองทัพ!

เห็นมือแมวน่ารักๆ ในซอมบี้ตัวใหม่นี้ไหม? แปลว่ารหัส `99` ที่อยู่บน DNA นั้นใช้การได้อย่างสมบูรณ์แบบแล้ว 😉

คุณสามารถลองเล่นอีกรอบไปได้เรื่อย ๆ ตามที่ต้องการจนกว่าจะได้ซอมบี้น้องแมวที่คุณพอใจ (น่าเสียดายที่คุณเก็บมันไว้ได้เพียงตัวเดียว เพราะฉะนั้นเลือกตัวที่ชอบที่สุดก็แล้วกันนะ) หลังจากนั้นก็เดินหน้าไปยังบทต่อไป เพราะเราใกล้จะจบบทเรียนที่ 2 แล้ว!
