---
title: Siste finpuss
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

 Det var det, du har fullført leksjon 2!

Du kan sjekke demoen til høyre for å se den i aksjon. Fortsett, jeg vet at du ikke kan vente til bunnen av denne siden 😉. Klikk en kattunge for å angripe, og se den nye kittyzombieen du får!

## JavaScript implementasjon

Når vi er klare til å distribuere denne kontrakten til Ethereum, samler vi og distribuerer `ZombieFeeding` - siden denne kontrakten er vår endelige kontrakt som arver fra `ZombieFactory`, og har tilgang til alle offentlige metoder i begge kontrakter.

La oss se på et eksempel på samspill med vår distribuerte kontrakt ved hjelp av JavaScript og web3.js:

```
var abi = /* abi generert av kompilatoren */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* Vår kontraktsadresse i Ethereum etter distribusjon */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Forutsatt at vi har vår zombie ID og kitty ID vi ønsker å angripe
let zombieId = 1;
let kittyId = 1;

// For å få CryptoKitty's bilde, må vi spørre om deres web-API. Denne
// informasjonen lagres ikke i blockchainen, bare i deres webserver.
// Hvis alt ble lagret i blockchain, måtte vi ikke bekymre oss
// om serveren går ned, at de endrer API-en eller at firmaet
// blokkerer oss fra å laste inn sine eiendeler hvis de ikke liker vårt zombie spill ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // gjør noe for å vise bildet
})

// When the user clicks on a kitty:
$(".kittyImage").click(function(e) {
  // Kjør vår kontrakts `feedOnKitty` metode
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Lytt etter en NewZombie-begivenhet fra vår kontrakt slik at vi kan vise den:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Denne funksjonen vil vise zombie, som i leksjon 1:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Test det!

Velg den katten du vil spise Din zombie DNA og kattens DNA vil kombinere, og du får en ny zombie i hæren din!

Legg merke til de søte kattbenene på din nye zombie? Det er våre endelige `99` siffer av DNA på jobben 😉

Du kan starte over og prøve igjen hvis du vil. Når du får en kittyzombie, du er fornøyd med (du får bare beholde en), gå videre og fortsett til neste kapittel for å fullføre leksjon 2!
