---
title: Mappature e Indirizzi
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // dichiarare qui le mappature

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.25;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          mapping (uint => address) public zombieToOwner;
          mapping (address => uint) ownerZombieCount;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              emit NewZombie(id, _name, _dna);
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(abi.encodePacked(_str)));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Rendiamo il nostro gioco multiplayer dando agli zombi nel nostro database un proprietario.

Per fare questo, avremo bisogno di 2 nuovi tipi di dati: `mapping` e `address`.

## Indirizzi

La blockchain di Ethereum è composta da **_accounts_**, puoi pensarli come dei conti bancari. Un conto ha un saldo di **_Ether_** (la valuta utilizzata sulla blockchain di Ethereum) e puoi inviare e ricevere pagamenti Ether su altri conti, proprio come il tuo conto bancario può trasferire denaro ad altri conti bancari.

Ogni account ha un `address`, puoi pensarlo come un numero di conto bancario (IBAN). È un identificatore univoco che punta a quell'account e si presenta così:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Questo indirizzo appartiene al team di CryptoZombies. Se ti piace CryptoZombies puoi inviarci un po 'di Ether! 😉)

Entreremo nel dettaglio degli indirizzi in un'altra lezione, per ora devi solo capire che un indirizzo è associato a un utente specifico (o ad un contratto intelligente).

Possiamo quindi usarlo come un ID univoco per la proprietà dei nostri zombi. Quando un utente crea nuovi zombi interagendo con la nostra app, imposteremo la proprietà di quegli zombi sull'indirizzo Ethereum che ha chiamato la funzione.

## Mappature

Nella lezione 1 abbiamo esaminato **_structs_** e **_arrays_**. **_Mappings_** sono un altro modo di archiviare i dati organizzati in Solidity.

La definizione di una `mapping` è simile alla seguente:

```
// Per un'app finanziaria memorizzare un uint che contiene il saldo del conto dell'utente:
mapping (address => uint) public accountBalance;
// Oppure potrebbe essere utilizzato per memorizzare / cercare nomi utente in base all'ID utente
mapping (uint => string) userIdToName;
```

Una mappatura è essenzialmente un archivio di valori-chiave per l'archiviazione e la ricerca di dati. Nel primo esempio, la chiave è un `address` e il valore è un `uint`, e nel secondo esempio la chiave è un `uint` e il valore una `string`.

# Facciamo una prova

Per memorizzare la proprietà degli zombi utilizzeremo due mappature: una che tiene traccia dell'indirizzo che possiede uno zombi e un'altra che tiene traccia di quanti zombi ha un proprietario.

1. Crea un mapping chiamato `zombieToOwner`. La chiave sarà un `uint` (memorizzeremo e cercheremo lo zombi in base al suo id) e il valore di un `address`. Rendiamo questa mappatura `public`.

2. Crea un mapping chiamato `ownerZombieCount`, dove la chiave è un `address` ed il valore un `uint`.
