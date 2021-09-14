---
title: Conclusione
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

Ecco fatto, hai completato la lezione 2!

Puoi vedere la demo a destra per vederla in azione. Vai avanti, so che non puoi aspettare fino alla fine di questa pagina 😉. Fai clic su un gattino per attaccare e vedi il nuovo gatto-zombi che ottieni!

## Implementazione JavaScript

Una volta che siamo pronti a distribuire questo contratto su Ethereum, compileremo ed implementeremo semplicemente `ZombieFeeding`, poiché questo contratto è il nostro contratto finale che eredita da `ZombieFactory` ed ha accesso a tutti i metodi pubblici in entrambi i contratti.

Diamo un'occhiata ad un esempio di interazione con il nostro contratto distribuito utilizzando JavaScript e web3.js:

```
var abi = /* abi generato dal compilatore */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* il nostro indirizzo del contratto su Ethereum dopo la distribuzione */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Supponendo che abbiamo l'ID del nostro zombi e l'ID del gattino che vogliamo attaccare
let zombieId = 1;
let kittyId = 1;

// Per ottenere l'immagine di CryptoKitty, dobbiamo interrogare la loro API web.
// Queste informazioni non sono memorizzate sulla blockchain, ma solo sul loro server web.
// Se tutto fosse archiviato su una blockchain, non dovremmo preoccuparci
// che il server si spenga, che cambino la loro API o che la società
// ci blocchi dal caricamento delle loro risorse se non gli piace il nostro gioco di zombi ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // fai qualcosa per visualizzare l'immagine
})

// When the user clicks on a kitty:
$(".kittyImage").click(function(e) {
  // Chiama il metodo `feedOnKitty` del nostro contratto
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Ascolta un evento NewZombie dal nostro contratto in modo da poterlo visualizzare:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Questa funzione mostrerà lo zombi, come nella lezione 1:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Provaci!

Seleziona il gattino di cui vuoi nutrirti. Il DNA del tuo zombi e il DNA del gattino si combineranno ed otterrai così un nuovo zombi nel tuo esercito!

Notate quelle simpatiche zampe di gatto sul vostro nuovo zombi? Queste sono le nostre ultime `99` cifre del DNA al lavoro 😉

Puoi ricominciare e riprovare se lo desideri. Quando ottieni uno zombi gattino di cui sei felice (devi solo tenerne uno), vai avanti e procedi al capitolo successivo per completare la lezione 2!
