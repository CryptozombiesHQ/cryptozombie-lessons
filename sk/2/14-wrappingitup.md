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
That's it, you've completed lesson 2!

Môžeš sa pozrieť na ukážku vpravo, aby si to všetko videl v akcii 😉. Klikni na mačku ktorú chceš napadnúť a sleduj aký zombie z nej vzíde.
You can check out the demo to the right to see it in action. Go ahead, I know you can't wait until the bottom of this page 😉. Click a kitty to attack, and see the new kitty zombie you get!

## Javascriptá implementácia
## Javascript implementation

Keď budeme pripravení nasadiť náš kontrakt na Ethereum blockchain, proste len skompilujeme a nasadíme `ZombieFeeding` - pretože to je náš finálny kontrakt ktorý dedí všetky vlasnosti z `ZombieFactory`. Ma prístup ku všetkým jej verejným metódam v oboch kontraktoch.
Once we're ready to deploy this contract to Ethereum we'll just compile and deploy `ZombieFeeding` — since this contract is our final contract that inherits from `ZombieFactory`, and has access to all the public methods in both contracts.

Poďme sa pozriet na ukážku kódu, ako by vyzerala práca s našim nasadeným kontraktom v Javascripte pomocou web3.js:
Let's look at an example of interacting with our deployed contract using Javascript and web3.js:

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
# Give it a try!

Zvoľ mačku na ktorej sa chceš nakŕmiť. DNA tvojho zombie a DNA napadnutej mačku sa skombinujú a ty získaš nového zombie do svojej armády!
Select the kitty you want to feed on. Your zombie's DNA and the kitty's DNA will combine, and you'll get a new zombie in your army!

Vidíš tie roztomilé mačacie labky na tvojom novom zombie? To je gén `99` v praxi!
Notice those cute cat legs on your new zombie? That's our final `99` digits of DNA at work 😉

Môžeš to vyskúšat niekoľko krát. Až dostaneš mačacieho zombie s ktorým budeš spokojný (môžeš si ponechať len jedného), pokračuj na ďalšiu kapitolu pre dokončenie Lekcie 2!
You can start over and try again if you want. When you get a kitty zombie you're happy with (you only get to keep one), go ahead and proceed to the next chapter to complete lesson 2!
