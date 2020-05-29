---
title: Conclusione
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  saveZombie: false
  zombieDeck:
    zombie:
      lesson: 6
    hideSliders: true
    answer: 1
---

Congratulazioni! Hai scritto con successo il tuo primo front-end Web3.js che interagisce con il tuo contratto intelligente.

Come ricompensa ottieni il tuo zombi `The Phantom of Web3` Livello 3.0 (per Web 3.0 😉), completo di una maschera che assomiglia ad una volpe. Dai un'occhiata a destra.

## Prossimi passi

Questa lezione è stata intenzionalmente di base. Volevamo mostrarti la logica di base di cui avresti bisogno per interagire con il tuo contratto intelligente, ma non volevamo impiegare troppo tempo per eseguire un'implementazione completa poiché la parte di codice Web3.js è abbastanza ripetitiva.

Quindi questa implementazione è stata lasciata a nudo, in chiaro. Ecco un elenco di idee per delle cose da implementare al fine di rendere il nostro front-end completo per il nostro gioco di zombi, se vuoi continuare e costruirlo da solo:

1. Implementazione di funzioni per `attack`, `changeName`, `changeDna` e funzioni ERC721 `transfer`, `ownerOf`, `balanceOf`, ecc. L'implementazione di queste funzioni sarebbe identica a tutte le altre transazioni `send` che abbiamo visto.

2. Implementare una "pagina di amministrazione" in cui è possibile eseguire `setKittyContractAddress`, `setLevelUpFee` e `withdraw`. Ancora una volta, non c'è una logica speciale sul front-end: queste implementazioni sarebbero identiche alle funzioni che abbiamo già visto. Dovresti solo assicurarti di averle chiamate dallo stesso indirizzo Ethereum che ha distribuito il contratto, poiché hanno il modificatore `onlyOwner`.

3. Nell'app ci sono diverse viste che vorremmo implementare:

  a. Una singola pagina zombi in cui è possibile visualizzare informazioni sullo zombi specifico con un permalink. Questa pagina mostrerebbe l'aspetto dello zombi, il suo nome, il suo proprietario (con un link alla pagina del relativo profilo utente), il suo conteggio delle vincite/sconfitte, la sua storia di battaglia, ecc.

  b. Una pagina utente in cui è possibile visualizzare l'esercito zombi dell'utente con un permalink. Potresti fare clic su un singolo zombi per visualizzarne la pagina e fare clic su uno zombi per attaccarlo se sei connesso a MetaMask ed hai un esercito.

  c. Una homepage, una variante della pagina utente, che mostra l'esercito zombi dell'utente corrente. (Questa è la pagina che abbiamo iniziato ad implementare in index.html).

4. Qualche metodo nell'interfaccia utente che consente all'utente stesso di nutrirsi di CryptoKitties. Potremmo avere un pulsante per ogni zombi sulla homepage che dice "Mangia", quindi una casella di testo che richiede all'utente di inserire l'ID di un gattino (o un URL a quel gattino, ad esempio <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Questo attiverebbe la nostra funzione `feedOnKitty`.

5. Alcuni metodi nell'interfaccia utente per consentire all'utente di attaccare gli zombi di un altro utente.

  Un modo per implementarlo sarebbe quando l'utente sta navigando nella pagina di un altro utente, potrebbe esserci un pulsante che dice "Attacca questo zombi". Quando l'utente fa clic su di esso, viene visualizzata una modale che contiene l'esercito di zombi dell'utente corrente e chiederà "Con quale zombi vorresti attaccare?"

  La home page dell'utente potrebbe anche avere un pulsante per ciascuno dei loro zombi che dice "Attacca uno zombi". Quando lo hanno cliccato, potrebbe apparire un modale con un campo di ricerca in cui poter digitare l'ID di uno zombi per cercarlo. Oppure un'opzione che dice "Attacca uno zombi casuale" che cercherà un numero casuale per loro.

  Vorremmo anche oscurare gli zombi dell'utente fino a che il periodo di recupero non sarà completato, quindi l'interfaccia utente potrebbe indicare all'utente che non può ancora attaccare con quello zombi e quanto tempo dovrà aspettare.

6. L'homepage dell'utente avrebbe anche delle opzioni per ogni zombi: per cambiare nome e per cambiare DNA e salire di livello (a pagamento). Tali opzioni sarebbero disattivate se l'utente non fosse ancora abbastanza alto di livello.

7. Per i nuovi utenti dovremmo visualizzare un messaggio di benvenuto con la richiesta di creare il primo zombi del loro esercito, che chiama `createRandomZombie()`.

8. Vorremmo aggiungere un evento `Attack` al nostro contratto intelligente con l'`address` dell'utente come proprietà `indexed`, come discusso nell'ultimo capitolo. Ciò ci consentirebbe di creare notifiche in tempo reale: potremmo mostrare all'utente un avviso popup quando uno dei loro zombi è stato attaccato, in modo da poter visualizzare l'utente/zombi che li ha attaccati e vendicarsi.

9. Probabilmente vorremmo anche implementare una sorta di cache sul front-end in modo da non interrogare sempre Infura con richieste per gli stessi dati. (La nostra attuale implementazione di `displayZombies` chiama `getZombieDetails` per ogni singolo zombi ogni volta che aggiorniamo l'interfaccia — ma realisticamente dobbiamo solo chiamarlo per il nuovo zombi che è stato aggiunto al nostro esercito).

10. Una chat room in tempo reale in modo da poter parlare con gli altri giocatori mentre distruggi il loro esercito di zombi? Sì grazie.

Questo è solo un inizio — sono sicuro che potremmo trovare ancora più funzioni — tuttavia già questo è un elenco enorme.

Dato che c'è un sacco di codice front-end che andrebbe a creare un'interfaccia completa come questa (HTML, CSS, JavaScript e un framework come React o Vue.js), per costruire questo intero front-end servirebbe probabilmente un intero corso con 10 lezioni. Quindi lasceremo a te questa impressionante implementazione.

> Nota: anche se il nostro contratto intelligente è decentralizzato, questo front-end per l'interazione con la nostra DApp sarà totalmente centralizzato sul nostro web server da qualche parte.
>
> Tuttavia, con l'SDK che stiamo creando (<a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>) sarai presto in grado di pubblicare front-end come questo dalla loro DAppChain invece che da un server web centralizzato. In questo modo, tra Ethereum e Loom DAppChain, l'intera app funzionerebbe al 100% sulla blockchain.

## Conclusione

Questo conclude la lezione 6. Ora hai tutte le competenze necessarie per codificare un contratto intelligente e creare un front-end che consenta agli utenti di interagire con esso!

Nella prossima lezione, completeremo l'ultimo pezzo mancante di questo puzzle: distribuire i tuoi contratti intelligenti ad Ethereum.

Vai avanti e fai clic su "Capitolo Successivo" per richiedere le tue ricompense!
