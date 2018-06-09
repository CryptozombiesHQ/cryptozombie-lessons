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

Náš Solidity kotnrakt je hotový. Teraz potrebujeme napísať Javascriptový frontend, ktorý bude prepojený s našim kontraktom.
Our Solidity contract is complete! Now we need to write a javascript frontend that interacts with the contract.

Ethereum má Javascriptovú knižnicu ktorá sa volá **_Web3.js_**.
Ethereum has a Javascript library called **_Web3.js_**.

V neskorších lekciách sa pozrieme na to ako nasaďiť náš kontrakt do blokchain a ako nastaviť Web3.js. Prezatiaľ sa však pozrieme len na ukážkový kód, ako by sme pomocou Web3.js pracovali s nasadeným kontraktom. 
In a later lesson, we'll go over in depth how to deploy a contract and set up Web3.js. But for now let's just look at some sample code for how Web3.js would interact with our deployed contract.

Ak ti to zatiaľ nedáva moc zmysel, nemaj obavy.
Don't worry if this doesn't all make sense yet.

```
// Takto by sme pristupovali k našemu kontraktu
var abi = /* abi vygenerované kompilátorom */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* adresa inštancie našeho kontraktu po nasadení na Etheruem blockchain */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` má prístup ku všetkým verejným funkciám a udalostiam našeho kontraktu

// naslúchač udalostí ktorý príjma textový vstup
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Zavoláme funkciu `createRandomZombie` našeho kontraktu
  ZombieFactory.createRandomZombie(name)
})

// Naslúcame na vyvolanie udalosti `NewZombie` a v prípade detekcie obnovíme stránku
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// zober Zombie DNA a obnov vzhľad zombie
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // v prípade že má menej ako 16 znakov, vyplň DNA na začiatku nulami
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // first 2 digits make up the head. We have 7 possible heads, so % 7
    // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
    // image files named "head1.png" through "head7.png" we load based on
    // this number:
    // prvé dve čísla defunjú hlavu. K dispozicií máme len 7 hláv, takže  
    // spravíme modulo % 7, aby sme dostali číslo v intervale 0 - 6. Potom
    // pridáme +1, aby sme mali číslo v intervale 1 - 7. Máme pripravnených
    // 7 obrázkov pomenovaných "head1.png" až po "head7.png". Na základe
    // našeho čísla zobrazíme jeden z týchto obrázkov.
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2nd 2 digits make up the eyes, 11 variations:
    // nasledujúca dvojica čísel bude určovat oči, pripravených máme 11 verzii
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variácií košele
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // posledných 6 čísel bude kontrolovať farbu. Použijeme
    // CSS Filter: hue-rotate ktorý má 360 stupňov
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Čo ďalej robí náš Javascript je to, že zoberie niektoré z hodnôt v `zombieDetails` vyššie a pridá štipku javascriptovej mágie (používame Vue.js)  na to, aby sme menili obrázky a aplikovali CSS filtre. V neskorších lekciách uvidíš kompletný kód.
What our javascript then does is take the values generated in `zombieDetails` above, and use some browser-based javascript magic (we're using Vue.js) to swap out the images and apply CSS filters. You'll get all the code for this in a later lesson.

# Vyskúšaj si to sám
# Give it a try!

Do boxu na pravej strane skús napísať meno a sleduj akého Zombie obdržíš.
Go ahead — type in your name to the box on the right, and see what kind of zombie you get!

**Až budeš mať zombie s akým si spokojný, klikni na "Next Chapter" nižšie aby si si uložil svojho zombie a dokončil tak lekciu 1!**
**Once you have a zombie you're happy with, go ahead and click "Next Chapter" below to save your zombie and complete lesson 1!**
