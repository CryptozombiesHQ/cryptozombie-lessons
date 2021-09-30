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

Solidity-kontrakten vår er ferdig! Nå trenger vi å skrive en JavaScript frontend som kan samhandle kontrakten vår.

Ethereum har et JavaScript library kalt **_Web3.js_**.

I en senere leksjon, kommer vi til å gå mer i dybden på hvordan distribuere en kontrakt og sette opp Web3.js. Men for nå la oss se på litt eksempel kode for hvordan Web3.js vil samhandle vår distribuerte kontrakt.

Ikke bli stresset hvis dette ikke gir mening helt enda.

```
// Slik tar vi kontakt med kontrakten vår:
var abi = /* abi generert av kompilatoren vår */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* kontrakt addressen vår etter distribusjon */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` har kontakt med kontraktens offentlige funksjoner og eventer

// En type event-lytter for å ta tekst-input:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Kjør kontraktens `createPseudoRandomZombie` funksjon:
  ZombieFactory.createPseudoRandomZombie(name)
})

// Lytt etter `NewZombie` eventet, og oppdater UI
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// ta Zombie-ens dna, og og oppdater bilde
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // gi DNA ekstra 0 hvis den har færre enn 16 sifre
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // første 2 sifre gjør opp hodet. Vi har syv forskjellige type hoder, så % 7
    // for å få nummer mellom 0 - 6, så legg til 1 for å bli mellom 1 - 7. Så vi har 7
    // Bilde fil kalt "head1.png" til "head7.png" laster vi basert på
    // dette nummeret:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // Andre 2 sifre gjør opp øyne, 11 variasjoner:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variasjoner av t-shorter:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // siste 6 kontrollerer farge. Oppdatert ved bruk av CSS filter: hue-rotate
    // som har 360 grader:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Det som javascript-en vår så gjør er å ta de genererte dataene i `zombieDetails` over, og bruker dem som nettleser-basert JavaScript magi (vi bruker Vue.js) for å bytte ut bildene og legge til CSS filter. Du kommer til å få all koden til dette i senere leksjoner.

# Test det!

Kom igjen — skriv inn navnet ditt i boksen til høyre, og se hva slags zombie du får!

**Med en gang du har en zombie som du er fornøyd med, klikk på "Next Chapter" for å lagre din zombie og bli ferdig med leksjon 1!**
