---
title: Storage vs Memory (Data location)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

        // Start here

        }
      "zombiefactory.sol": |
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

        mapping (uint => address) public zombieToOwner;
        mapping (address => uint) ownerZombieCount;

        function _createZombie(string memory _name, uint _dna) private {
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        emit NewZombie(id, _name, _dna);
        }

        function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
        }

        function createRandomZombie(string memory _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
        }

        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;
      import "./zombiefactory.sol";
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; }
      }
---

In Solidity, there are two locations you can store variables — in `storage` and in `memory`.

***Storage*** odnosi się do zmiennych przechowywanych na stałe w blockchain'ie. Zmienne ***Memory*** są chwilowe, tzn. że są usuwane pomiędzy zewnętrznymi wywołaniami funkcji Twojej umowy (kontraktu). Pomyśl o tym jak o dysku twardym komputera vs pamięci RAM.

Zazwyczaj nie trzeba używać tych słów kluczowych, ponieważ Solidity domyślnie je obsługuje. Zmienne stanu (zmienne zadeklarowane poza funkcjami) są domyślnie ` storage ` i są zapisywane na stałe w blockchain'ie, podczas gdy zmienne zadeklarowane wewnątrz funkcji to ` memory ` i znikają one po zakończeniu wywołania funkcji.

Jednakże, są przypadki kiedy będziesz potrzebował użyć tych słówek kluczowych, mianowicie gdy mamy do czynienia ze ***strukturami*** i ***tablicami*** wewnątrz funkcji:

    contract SandwichFactory {
      struct Sandwich {
        string name;
        string status;
      }
    
      Sandwich[] sandwiches;
    
      function eatSandwich(uint _index) public {
        // Sandwich mySandwich = sandwiches[_index];
    
        // ^ Wygląda bardzo prosto, lecz Solidity wyda ostrzeżenie
        // mówiące Ci o tym, że powinienieś wyraźnie zadeklarować tutaj `storage` lub `memory`.
    
        // Więc zamiast tego powinieneś zadeklarować `storage` tak:
        Sandwich storage mySandwich = sandwiches[_index];
        // ...w którym to przypadku `mySandwich` jest wskaźnikiem do `sandwiches[_index]`
        // w storage, i...
        mySandwich.status = "Eaten!";
        // ...to zmieni na stałe `sandwiches[_index]` w blockchain'ie.
    
        // Jeśli chcesz tylko skopiować użyj `memory`:
        Sandwich memory anotherSandwich = sandwiches[_index + 1];
        // ...w przypadku gdy `anotherSandwich` jest tylko kopią 
        // danych w memory, i...
        anotherSandwich.status = "Eaten!";
        // ...tylko modyfikuje chwilową zmienną oraz nie ma wpływu 
        // na `sandwiches[_index + 1]`. Ale możesz zrobic to tak:
        sandwiches[_index + 1] = anotherSandwich;
        // ...jeśli chcesz z powrotem skopiować zmiany do storage blockchain'u.
      }
    }
    

Nie przejmuj się, jeśli jeszcze nie wiesz, kiedy używać któregoś z tych słówek - w tym samouczku dowiesz się, kiedy użyć ` storage `, a kiedy ` memory `. Kompilator Solidity podaje również ostrzeżenia, informujące o tym, kiedy należy użyć jednego z tych słów kluczowych.

Jest to wystarczające, aby wiedzieć, że istnieją przypadki gdzie musisz wyraźnie zadeklarować `storage` lub `memory`!

# Wyprobójmy zatem

Nadszedł czas, aby dać naszym Zombiakom mozliwość karmienia i pomnażania się!

Kiedy Zombi karmi się jakąś formą życia, jego DNA łączy się z innym DNA w celu stworzenia nowego Zombi.

1. Stwórz funkcję, o nazwie `feedAndMultiply`. Będzie ona odbierała dwa parametry: `_zombieId` (`uint`) i `_targetDna` (również `uint`). Funkcja ta powinna być `public`.

2. We don't want to let someone else feed our zombie! Najpierw upewnijmy się, że jesteśmy właścicielami tego zombie. Add a `require` statement to verify that `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).
    
    > Uwaga: Znowu nasze sprawdzanie odpowiedzi jest prymitywne, więc oczekuje aby `msg.sender` było na początku i oznaczy to jako błąd, jeśli zmienisz kolejność. Ale zwykle, gdy kodujesz, możesz użyć dowolnej kolejności - obie są poprawne.

3. Będziemy potrzebować DNA tego Zombi. Następną rzeczą, którą nasza funkcja powinna robić jest zadeklarowanie lokalnego `Zombie` o nazwie `myZombie` (który będzie wskaźnikiem do `storage`). Ustaw tą zmienną równą indeksowi `_zombieId` w naszej tablicy `zombies`.

Powinieneś mieć 4 linie kodu, włącznie z zamykającymi klamrami `}`.

Będziemy kontynuować wypełnianie tej funkcji w następnym rozdziale!