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

Solidity contract ของเราก็เสร็จเรียบร้อยแล้ว! ตอนนี้ก็ได้เวลาของการเขียน javascript ที่จะไว้ใช้ด้านหน้าเพื่อ interact กับ contract แล้ว

Ethereum นั้นมี Javascript library  ชื่อว่า **_Web3.js_**

ในบทหลังๆ เราจะทำการเรียนรู้ในเชิงลึกเกี่ยวกับการนำ contract มาปรับใช้และติดตั้ง Web3.js แต่ในตอนนี้จะขอพูดถึงแค่ตัวอย่างของโค้ดว่า Web3.jsนั้น interact กับ contractที่นำมาปรับใช้ของเราอย่างไร 

แต่ยังไม่ต้องกังวลหากยังไม่เข้าใจโค้ดที่กำลังจะนำมาแสดงให้ดู:

```
// การเข้าถึง contract:
var abi = /* abi จะถูกสร้างโดยคอมไพล์เลอร์ */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /*ส่วนนี้คือที่อยู่ contract ของเราบน Ethereum หลังจากได้นำมาใช้ */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` ได้ทำการเข้าถึงฟังก์ชั่นและอีเว้นท์ต่างๆที่เป็นชนิด public ใน contract ของเราเรียบร้อย

// ต่อไปนี้จะเป็น event listener บางตัวที่จะรับค่า input ชนิดข้อความ:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // เรียกฟังก์ชัน `createPseudoRandomZombie` ในcontract ของเรา:
  ZombieFactory.createPseudoRandomZombie(name)
})

// รับฟังเหตุการณ์ `NewZombie` event, and update the UI `NewZombie` พร้อมทั้งทำการอัพเดท User Interface หรือการแสดงผลในส่วนของผู้ใช้
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// รับค่า DNA ของซอมบี้และทำการอัพเดทรูปภาพ
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // เว้นระยะห่างด้านหน้าของ DNA ด้วยเลข 0 หากจำนวน DNA นั้นมีความยาวน้อยกว่า 16ตัว
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    //DNA สองตัวแรกจะบ่งบอกลักษณะของหัว และเราสามารถเลือกได้ 7 แบบดังนั้น จะทำการ % ด้วย 7 
    // เพื่อที่จะได้จำนวน 0 – 6 จากนั้น+ด้วย1เพื่อให้ได้เป็นจำนวน 1 – 7 ทำให้เรามี7ตัวเลือก
    // ไฟล์รูปภาพชื่อว่า"head1.png" ไปจนถึง "head7.png" 
    // this number:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2ตัวถัดไปจะใช้เพื่อการเลือกรูปแบบของตา ถึงเราจะเลือกได้11รูปแบบ:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // เลือกเสื้อได้6แบบ:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // ข้อมูล6ตัวสุดท้ายจะเอาไว้ใช้เลือกสี โดยเราจะทำการอัพเดทโดยใช้ CSS filter: hue-rotate
    // ซึ่งมี 360องศา:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

และนี่ก็คือ javascript ของเรา ที่จะทำการสร้าง `zombieDetails` ด้านบน และอาจจะต้องใช้ javascripts ที่หามาจาก browser อีกเล็กน้อย (ในที่นี้เราใช้ Vau.js) เพื่อใช้ในการเปลี่ยนรูปต่างๆ ไปมาและใส่ CSS filter ต่างๆ ซึ่งคุณจะเข้าใจโค้ดทั้งหมดนี้ในบทต่อๆ ไป

# ลองมาทดสอบกัน!

ลองพิมพ์ชื่อของคุณในกล่องข้อความด้านขวาเพื่อดูว่าซอมบี้ของคุณจะหน้าตาเป็นอย่างไร

**เมื่อได้ซอมบี้ตามที่คุณพอใจแล้ว ให้เลือกคำสั่ง “Next Chapter”ด้านล่างเพื่อทำการบันทึกซอมบี้ของคุณและสำเร็จบทเรียนที่1!**
