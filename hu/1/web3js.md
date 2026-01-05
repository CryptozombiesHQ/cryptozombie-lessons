---
title: Web3.js
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

A Solidity szerződésünk kész! Most írnunk kell egy JavaScript frontend-et, amely interaktál a szerződéssel.

Az Ethereum-nak van egy JavaScript könyvtára, a **_Web3.js_**.

Egy későbbi leckében részletesen átmegyünk a szerződés telepítésén és a Web3.js beállításán. De most csak nézzünk meg néhány példa kódot, hogy a Web3.js hogyan interaktálna a telepített szerződésünkkel.

Ne aggódj, ha ez még nem mindegyik értelmes.

```
// Így érnénk el a szerződésünket:
var abi = /* abi generálva a fordító által */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* szerződésünk címe az Ethereumon telepítés után */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// A `ZombieFactory` hozzáfér a szerződésünk nyilvános függvényeihez és eseményeihez

// valamilyen esemény figyelő a szöveg bemenethez:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Hívjuk meg a szerződésünk `createRandomZombie` függvényét:
  ZombieFactory.createRandomZombie(name)
})

// Hallgassuk a `NewZombie` eseményt, és frissítsük a felhasználói felületet
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// vedd a Zombie DNS-t, és frissítsd a képet
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // töltse ki a DNS-t vezető nullákkal, ha kevesebb, mint 16 karakter
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // az első 2 számjegy alkotja a fejet. 7 lehetséges fejünk van, tehát % 7
    // hogy 0 - 6 közötti számot kapjunk, majd adjunk hozzá 1-et, hogy 1 - 7 legyen. Aztán 7
    // képfájlunk van "head1.png" -től "head7.png"-ig, amelyeket ezen szám alapján töltünk be:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // a 2. 2 számjegy alkotja a szemet, 11 variáció:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 póló variáció:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // az utolsó 6 számjegy szabályozza a színt. CSS filter: hue-rotate használatával frissítve
    // amely 360 fokos:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "Egy 1. szintű CryptoZombie",
  }
  return zombieDetails
}
```

Amit a JavaScriptünk csinál, az az, hogy veszi a `zombieDetails`-ben generált értékeket, és böngésző-alapú JavaScript varázslatot használ (Vue.js-t használunk) a képek cseréjéhez és CSS szűrők alkalmazásához. Minden kódot megkapsz ehhez egy későbbi leckében.

# Próbáld ki!

Gyerünk — írd be a nevedet a jobb oldali mezőbe, és nézd meg, milyen zombit kapsz!

**Amint van egy zombid, amellyel elégedett vagy, menj előre és kattints a "Következő fejezet" gombra lent, hogy elmentsd a zombidat és befejezd az 1. leckét!**
