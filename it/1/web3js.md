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

Il nostro contratto di Solidity è completo! Ora dobbiamo scrivere un frontend JavaScript che interagisce con il contratto.

Ethereum ha una libreria JavaScript chiamata **_Web3.js_**.

In una lezione successiva esamineremo in dettaglio come distribuire un contratto e configurare Web3.js. Ma per ora diamo un'occhiata al codice di esempio di come Web3.js interagirebbe con il nostro contratto distribuito.

Non preoccuparti se questo non ha ancora senso.

```
// Ecco come accediamo al nostro contratto:
var abi = /* abi generato dal compilatore */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* il nostro indirizzo del contratto su Ethereum dopo la distribuzione */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` ha accesso alle funzioni e agli eventi pubblici del nostro contratto

// una specie di listener di eventi per prendere l'input di testo:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Chiama la funzione `createPseudoRandomZombie` del nostro contratto:
  ZombieFactory.createPseudoRandomZombie(name)
})

// Ascolta l'evento `NewZombie` e aggiorna l'UI (Interfaccia Utente)
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// prende il DNA di zombi ed aggiorna la nostra immagine
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // riempie il DNA con degli zeri iniziali se è inferiore a 16 caratteri
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // le prime 2 cifre compongono la testa. Abbiamo 7 possibili teste, quindi % 7
    // per ottenere un numero 0 - 6, si può aggiungere 1 per renderlo 1 - 7. Quindi abbiamo 7
    // file di immagini chiamati da "head1.png" a "head7.png" che carichiamo in base
    // a questo numero:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // Le seconde 2 cifre compongono gli occhi, 11 variazioni:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 varianti di vestiti:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // le ultime 6 cifre controllano il colore. Aggiorna usando il filtro CSS: hue-rotate
    // che ha 360 gradi:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "CryptoZombie di livello 1",
  }
  return zombieDetails
}
```

Ciò che il nostro JavaScript fa è prendere i valori generati sopra in `zombieDetails` ed usare un po' di magia JavaScript basata su browser (stiamo usando Vue.js) per scambiare le immagini e applicare i filtri CSS. Otterrai tutto il codice per questo in una lezione successiva.

# Provalo anche tu!

Vai avanti: digita il tuo nome nella casella a destra e vedi che tipo di zombi ottieni!

**Una volta che hai uno zombi di cui sei soddisfatto, vai avanti e fai clic su "Capitolo Successivo" di seguito per salvare lo zombi e completare la lezione 1!**
