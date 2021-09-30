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

Náš Solidity kontrakt je hotový. Teraz potrebujeme napísať Javascriptový frontend, ktorý bude prepojený s našim kontraktom.

Ethereum má k dispozícii Javascriptovú knižnicu **_Web3.js_**.

V neskorších lekciách sa pozrieme na to, ako náš kontrakt nasaďiť na blokchain, a ako nastaviť Web3.js. Zatiaľ sa však pozrieme len na ukážkový kód, Ilustrujeme, ako by sme pomocou Web3.js pracovali s nasadeným kontraktom. 

Ak ti to zatiaľ nedáva moc zmysel, nemaj obavy.

```
// Takto by sme pristupovali k našemu kontraktu
var abi = /* abi vygenerované kompilátorom */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* adresa inštancie našeho kontraktu po nasadení na Ethéreum blockchain */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` má prístup ku všetkým verejným funkciám a udalostiam našeho kontraktu

// naslúchač udalostí ktorý príjma textový vstup
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Zavoláme funkciu `createPseudoRandomZombie` našeho kontraktu
  ZombieFactory.createPseudoRandomZombie(name)
})

// Naslúchame na vyvolanie udalosti `NewZombie`. V prípade detekcie takej udalosti stránku obnovíme
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// Zober Zombie DNA a obnov vzhľad zombie
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // v prípade že má menej ako 16 znakov, vyplň DNA na začiatku nulami
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // Prvé dve čísla defunjú hlavu. K dispozicií máme len 7 hláv, takže  
    // spravíme modulo % 7, aby sme dostali číslo v intervale 0 - 6. Potom
    // pridáme +1, aby sme mali číslo v intervale 1 - 7. Máme pripravnených
    // 7 obrázkov pomenovaných "head1.png" až po "head7.png". Na základe
    // našeho čísla zobrazíme jeden z týchto obrázkov.
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // Nasledujúca dvojica čísel bude určovat oči, pripravených máme 11 verzií.
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variácií košele
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // Posledných 6 čísel bude kontrolovať farbu. Použijeme
    // 360 stupňový CSS Filter hue-rotate 
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Náš JavaScript ďalej vezme niektoré z hodnôt zo `zombieDetails` vyššie a so štipkou javascriptovej mágie (používame Vue.js) dosiahneme, aby sme menili obrázky a aplikovali CSS filtre. V neskorších lekciách uvidíš kompletný kód.

# Vyskúšaj si to sám

Do boxu na pravej strane skús napísať meno a sleduj akého Zombie obdržíš.

**Až budeš mať zombie s akým si spokojný, klikni na "Ďalšia Kapitola" nižšie. Tvoj zombie bude uložený a ty ukončíš lekciu 1!**
