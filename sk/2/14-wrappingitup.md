---
title: Zhrnutie
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

To je všetko, podarilo sa ti dokončiť Lekciu 2!

Môžeš sa pozrieť na ukážku vpravo, aby si to všetko videl v akcii 😉. Klikni na mačku ktorú chceš napadnúť a sleduj aký zombie z nej vzíde.

## Javascriptá implementácia

Keď budeme pripravení nasadiť náš kontrakt na Ethereum blockchain, proste len skompilujeme a nasadíme `ZombieFeeding` - pretože to je náš finálny kontrakt ktorý dedí všetky vlasnosti z `ZombieFactory`. Ma prístup ku všetkým jej verejným metódam v oboch kontraktoch.

Poďme sa pozrieť na ukážku kódu, ako by vyzerala práca s našim nasadeným kontraktom v Javascripte pomocou web3.js:

```
var abi = /* abi vygenerované kompilátorom */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* adresa našeho kontraktu na Ethreum blockchain po nasadení */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Predpokldmáme že už máme vybrané ID zombie ktorý bude útočiť, a ID mačky ktorá bude napadnutá 
let zombieId = 1;
let kittyId = 1;

// Na to aby sme sa dostali k obrázku CryptoKitty, museli by sme použit
// ich webové API. Táto čast informácie nie je uložená na blokchaine,
// iba ich webserveroch. Keby bolo všetko na blockchain, nemuseli by sme 
// sa obávať o možný výpadok ich serverov, zmenu ich API, alebo spoločnosti
// blokujúcej načitávanie ich dát v prípade že by sa im nepáčila 
// naša zombie hra
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // niečo spravíme zo získaným obrázkom
})

// Keď užívatel klikne na mačku
$(".kittyImage").click(function(e) {
  // Zavoláme našu funkciu `feedOnKitty` na našom kontrakte
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Naslúchaj na vyvolanie udalosti NewZombie aby sme mohli zobraziť nového zombie
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Táto funkcia zobrazí zombie, presne ako v lekcii 1:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Vyskúšaj si to sám

Zvoľ mačku na ktorej sa chceš nakŕmiť. DNA tvojho zombie a DNA napadnutej mačky sa skombinujú a ty získaš nového zombie do svojej armády!

Vidíš tie roztomilé mačacie labky na tvojom novom zombie? To je gén `99` v praxi!

Môžeš to vyskúšať aj viac krát. Až dostaneš mačacieho zombie s ktorým budeš spokojný (môžeš si ponechať len jedného), pokračuj na ďalšiu kapitolu pre dokončenie Lekcie 2!
