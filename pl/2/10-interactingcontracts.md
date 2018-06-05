---
title: Co jedza Zombi?
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        // Utwórz tutaj KittyInterface 
        
        contract ZombieFeeding is ZombieFactory {
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        _createZombie("NoName", newDna);
        }
        
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;
        
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
        NewZombie(id, _name, _dna);
        }
        
        function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
        }
        
        function createRandomZombie(string _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      }
---
Nadszedł czas, aby nakarmić nasze Zombiaki! A co lubią one jeśc najbardziej?

Cóż, tak się składa, że CryptoZombi uwielbiają jeść...

**CryptoKitties!** 

(Yes, I'm serious 

Z związku z tym, potrzebujemy odczytać kittyDna z kontraktu CryptoKitties. Możemy to zrobić, ponieważ dane CryptoKitties są przechowywane jawnie w blockchain'ie. Czyż blockchain nie jest wspaniały?!

Don't worry — our game isn't actually going to hurt anyone's CryptoKitty. We're only *reading* the CryptoKitties data, we're not able to actually delete it 

## Interakcja z innymi umowami (kontraktami)

Aby nasz kontrakt mógł porozumiewać się z innym kontraktem w blockchain'ie, najpierw musimy zdefiniować coś, co nosi nazwę: ***interface***.

Spójrzmy na prosty przykład. Powiedzmy, że zawarto umowę w blockchain'ie, która wygląda tak:

    contract LuckyNumber {
      mapping(address => uint) numbers;
    
      function setNum(uint _num) public {
        numbers[msg.sender] = _num;
      }
    
      function getNum(address _myAddress) public view returns (uint) {
        return numbers[_myAddress];
      }
    }
    

Byłaby to prosta umowa, w której każdy może przechowywać swój szczęśliwy numer i zostałby on powiązany z adresem Ethereum. Następnie każdy mógłby spojrzeć na szczęśliwy numer tej osoby poprzez użycie swojego adresu.

Teraz, powiedzmy, że mamy zewnętrzny kontrakt, który chce czytać dane w tym kontrakcie używając funkcji `getNum`.

Najpierw musimy zdefioniować ***interfejs*** kontraktu `LuckyNumber` :

    contract NumberInterface {
      function getNum(address _myAddress) public view returns (uint);
    }
    

Zauważ, że wygląda to zupełnie jak definiowanie kontraktu, z niewielkimi różnicami. Po pierwsze, deklarujemy tylko te funkcje, z którymi chcemy wejść w interakcję — w tym przypadku `getNum` — i nie nadmieniamy tu żadnych innych funkcji czy zmiennych.

Po drugie, nie definiujemy ciał funkcji. Zamiast nawiasów klamrowych (`{` oraz `}`), po prostu kończymy funkcję średnikiem (`;`).

Wygląda to więc jak szkielet kontraktu. W ten sposób kompilator wie, że jest to interfejs.

Poprzez dołączenie tego interfejsu w kodzie zdecentralizowanej aplikacji nasz kontrakt wie jak wyglądają funkcje innego kontraktu, jak je wywoływać i jakiej oczekiwać odpowiedzi.

Wejdziemy w wywoływanie funkcji innego kontraktu w następnej lekcji, a na ta chwilę, zadeklarujmy nasz interfejs dla kontraktu CryptoKitties.

# Wypróbujmy zatem

Zajrzeliśmy dla Ciebie do kodu źródłowego CryptoKittties i znaleźliśmy funkcję o nazwie `getKitty`, która zwraca wszystkie dane kitty, włączając w to "geny" (czyli to, co nasza gra potrzebuje aby uformować nowego Zombiaka!).

Funkcja ta wygląda następująco:

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
    ) {
        Kitty storage kit = kitties[_id];
    
        // if this variable is 0 then it's not gestating
        isGestating = (kit.siringWithId != 0);
        isReady = (kit.cooldownEndBlock <= block.number);
        cooldownIndex = uint256(kit.cooldownIndex);
        nextActionAt = uint256(kit.cooldownEndBlock);
        siringWithId = uint256(kit.siringWithId);
        birthTime = uint256(kit.birthTime);
        matronId = uint256(kit.matronId);
        sireId = uint256(kit.sireId);
        generation = uint256(kit.generation);
        genes = kit.genes;
    }
    

The function looks a bit different than we're used to. You can see it returns... a bunch of different values. If you're coming from a programming language like Javascript, this is different — in Solidity you can return more than one value from a function.

Now that we know what this function looks like, we can use it to create an interface:

1. Define an interface called `KittyInterface`. Remember, this looks just like creating a new contract — we use the `contract` keyword.

2. Inside the interface, define the function `getKitty` (which should be a copy/paste of the function above, but with a semi-colon after the `returns` statement, instead of everything inside the curly braces.