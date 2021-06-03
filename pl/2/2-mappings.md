---
title: Mapowanie i Adresy
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      event NewZombie(uint zombieId, string name, uint dna);

      uint dnaDigits = 16;
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      // declare mappings here

      function _createZombie(string memory _name, uint _dna) private {
      uint id = zombies.push(Zombie(_name, _dna)) - 1;
      emit NewZombie(id, _name, _dna);
      }

      function _generateRandomDna(string memory _str) private view returns (uint) {
      uint rand = uint(keccak256(abi.encodePacked(_str)));
      return rand % dnaModulus;
      }

      function createRandomZombie(string memory _name) public {
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      event NewZombie(uint zombieId, string name, uint dna);
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      mapping (uint => address) public zombieToOwner; mapping (address => uint) ownerZombieCount;
      function _createZombie(string memory _name, uint _dna) private { uint id = zombies.push(Zombie(_name, _dna)) - 1; emit NewZombie(id, _name, _dna); }
      function _generateRandomDna(string memory _str) private view returns (uint) { uint rand = uint(keccak256(abi.encodePacked(_str))); return rand % dnaModulus; }
      function createRandomZombie(string memory _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---

Zróbmy z naszej gry multiplayer poprzez nadanie Zombiakom z naszej bazy właściciela.

Aby to zrobic, potrzebujemy 2 nowe typy danych: `mapping` i `address`.

## Adresy

Blockchain sieci Ethereum jest złożony z ***kont***, o których można myśleć jak o kontach bankowych. Konto posiada saldo ***Etheru*** (waluta używana w blockchain'ie Ethereum) i jesteśmy w stanie wysyłać oraz odbierać płatności do innych kont, tak samo jak z Twojego konta bankowego możesz przelać pieniądze na inne konto bankowe.

Każde konto posiada `adres`, który jest jak numer konta bankowego. Jest to unikatowy identyfikator, który należy do tego konta i przykładowo wygląda tak:

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(This address belongs to the CryptoZombies team. If you're enjoying CryptoZombies, you can send us some Ether! 

W szczegóły adresów zagłębimy sie później, natomiast na tą chwilę musisz wiedzieć, że **adres jest własnością określonego użytkownika** (lub kontraktu).

Więc możemy go użyć jako unikatowe ID dla posiadania naszych Zombi. Kiedy użytkownik tworzy nowego Zombi poprzez interakcję z naszą aplikacją, konfigurujemy posiadanie tych Zombi w adresie Ethereum, który wywołał funkcję.

## Mapowanie

W lekcji 1 widzieliśmy ***struktury*** i ***tablice***. ***Mapowania*** są innym sposobem przechowywania zorganizowanych danych w języku Solidity.

Definiowanie `mapowania` wygląda następująco:

    // dla aplikacji finansowej, przechowuj uint, który posiada saldo konta użytkownika:
    mapping (address => uint) public accountBalance;
    // lub może byc użyte do przechowywania / sprawdzenia nazw użytkowników opartych na userID
    mapping (uint => string) userIdToName;
    

Mapowanie to zasadniczo klucz-wartość do przechowywania i sprawdzania danych. W pierwszym przykładzie, kluczem jest `adres`, a wartością jest `uint`, natomiast w drugim klucz to `uint`, a wartość `string`.

# Wypróbujmy zatem

Do przechowywania własności Zombi, mamy zamiar użyć dwóch mapowań: jedno, które przechowuje informacje o adresie i jest właścicielem Zombi, drugie, które przechowuje informacje o tym ile Zombi posiada właściciel.

1. Stwórz mapowanie i nazwij je `zombieToOwner`. Kluczem będzie `uint` (będziemy przechowywać i sprawdzać Zombiaka opartego na jego ID), a wartością `address`. Uczyńmy to mapowanie `publicznym`.

2. Kolejne mapowanie nazwij `ownerZombieCount`, gdzie kluczem jest `address`, a wartością `uint`.