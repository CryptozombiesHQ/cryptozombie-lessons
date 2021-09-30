---
title: Immutabilità dei Contratti
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          // 1. Rimuovilo:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Cambia questo in una semplice dichiarazione:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Aggiungi qui il metodo setKittyContractAddress

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }

        }
      "zombiefactory.sol": |
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

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external {
          kittyContract = KittyInterface(_address);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

Fino ad ora Solidity era molto simile ad altri linguaggi come JavaScript. Ma ci sono numerose DApp di Ethereum che in realtà sono abbastanza diverse dalle normali applicazioni.

Per cominciare, dopo aver distribuito un contratto su Ethereum, è **_ immutable_**, il che significa che non può mai essere modificato o aggiornato di nuovo.

Il codice iniziale che distribuisci ad un contratto rimarrà lì, in modo permanente, sulla blockchain. Questo è uno dei motivi per cui la sicurezza è una preoccupazione così grande in Solidity. Se c'è un difetto nel codice del contratto non c'è modo di correggerlo in seguito. Dovresti dire ai tuoi utenti di iniziare ad utilizzare un indirizzo di contratto intelligente diverso contenente la correzione.

Ma questa è anche una caratteristica dei contratti intelligenti. Il codice è legge. Se leggi il codice di un contratto intelligente e lo verifichi, puoi essere sicuro che ogni volta che chiami una funzione farà esattamente ciò che il codice dice che farà. Nessuno può in seguito cambiare quella funzione e darti risultati inaspettati.

## Dipendenze esterne

Nella Lezione 2 abbiamo codificato a fondo l'indirizzo del contratto CryptoKitties nella nostra DApp. Ma cosa accadrebbe se il contratto CryptoKitties avesse un bug e qualcuno distruggesse tutti i gattini?

È improbabile ma se ciò accadesse renderebbe la nostra DApp completamente inutile: la DApp indicherebbe un indirizzo che non restituirebbe mai alcun gattino. I nostri zombi non sarebbero più in grado di mangiare gattini e non potremmo modificare il nostro contratto per correggerlo.

Per questo motivo, spesso, ha senso disporre di funzioni che consentano di aggiornare parti chiave della DApp.

Ad esempio, invece di codificare a fondo l'indirizzo del contratto CryptoKitties nella nostra DApp, dovremmo probabilmente avere una funzione `setKittyContractAddress` che ci consente di modificare questo indirizzo in futuro nel caso in cui succeda qualcosa al contratto CryptoKitties.

## Facciamo una prova

Aggiorniamo il nostro codice della lezione 2 per poter modificare l'indirizzo del contratto CryptoKitties.

1. Elimina la riga di codice in cui abbiamo codificato `ckAddress`.

2. Cambia la riga in cui abbiamo creato `kittyContract` per dichiarare semplicemente la variabile, ovvero non impostarla uguale a nulla.

3. Creare una funzione chiamata `setKittyContractAddress`. Prenderà un argomento `_address` (un `address`) e dovrebbe essere una funzione `external`.

4. All'interno della funzione, aggiungi una riga di codice che imposta `kittyContract` uguale a `KittyInterface(_address)`.

> Nota: se noti una falla di sicurezza con questa funzione, non ti preoccupare, la ripareremo nel prossimo capitolo ;)
