---
title: Összefoglalás
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

Ez az, befejezted a 2. leckét!

Megnézheted a demót a jobb oldalon, hogy működés közben lásd. Gyerünk, tudom, hogy nem tudsz várni az oldal aljáig 😉. Kattints egy macskára a támadáshoz, és nézd meg az új macska-zombit, amit kapsz!

## JavaScript implementáció

Amikor készen állunk a szerződés Ethereumra történő telepítésére, egyszerűen fordítjuk és telepítjük a `ZombieFeeding`-et — mivel ez a szerződés a végső szerződésünk, amely örökli a `ZombieFactory`-t, és hozzáfér minden nyilvános metódushoz mindkét szerződésben.

Nézzünk meg egy példát a telepített szerződésünkkel való interakcióra JavaScript és web3.js használatával:

```
var abi = /* a fordító által generált abi */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* szerződésünk címe az Ethereumon a telepítés után */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Feltételezve, hogy megvan a zombink ID-ja és a macska ID-ja, amelyet támadni akarunk
let zombieId = 1;
let kittyId = 1;

// A CryptoKitty képének lekéréséhez lekérdezzük a webes API-jukat. Ez
// az információ nincs tárolva a blockchainen, csak a webszerverükön.
// Ha minden a blockchainen lenne tárolva, nem kellene aggódnunk
// a szerver leállása, az API megváltoztatása, vagy a cég
// blokkolása miatt, ha nem tetszik nekik a zombi játékunk ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // csinálj valamit a kép megjelenítéséhez
})

// Amikor a felhasználó rákattint egy macskára:
$(".kittyImage").click(function(e) {
  // Hívjuk meg a szerződésünk `feedOnKitty` metódusát
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Figyeljünk egy NewZombie eseményre a szerződésünkből, hogy megjeleníthessük:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Ez a függvény megjeleníti a zombit, mint az 1. leckében:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Próbáld ki!

Válaszd ki a macskát, amelyen táplálkozni szeretnél. A zombid DNS-e és a macska DNS-e összekeveredik, és kapsz egy új zombit a seregedbe!

Észrevetted az aranyos macska lábakat az új zombidon? Ez az utolsó `99` DNS számjegy működik 😉

Újrakezdheted és újra megpróbálhatod, ha akarod. Amikor kapsz egy macska-zombit, amellyel elégedett vagy (csak egyet tarthatsz meg), folytasd a következő fejezettel, hogy befejezd a 2. leckét!
