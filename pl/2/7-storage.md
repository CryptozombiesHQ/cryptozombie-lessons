---
title: Storage vs Memory
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
        
        contract ZombieFeeding is ZombieFactory {
        
        // zacznij tutaj
        
        }
      "zombiefactory.sol": |
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
      contract ZombieFeeding is ZombieFactory {
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; }
      }
---
W Solidity są dwa miejsca gdzie można przechowywać zmienne — w `storage` oraz w `memory`.

***Storage*** odnosi się do zmiennych przechowywanych na stałe w blockchain'ie. Zmienne ***Memory*** są chwilowe, tzn. że są usuwane pomiędzy zewnętrznymi wywołaniami funkcji Twojej umowy (kontraktu). Pomyśl o tym jak o dysku twardym komputera vs pamięci RAM.

Zazwyczaj nie trzeba używać tych słów kluczowych, ponieważ Solidity domyślnie je obsługuje. Zmienne stanu (zmienne zadeklarowane poza funkcjami) są domyślnie ` storage ` i zapisywane na stałe w blockchain'ie, podczas gdy zmienne zadeklarowane wewnątrz funkcji to ` memory ` i znikną one po zakończeniu wywołania funkcji.

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
    
        // If you just want a copy, you can use `memory`:
        Sandwich memory anotherSandwich = sandwiches[_index + 1];
        // ...in which case `anotherSandwich` will simply be a copy of the 
        // data in memory, and...
        anotherSandwich.status = "Eaten!";
        // ...will just modify the temporary variable and have no effect 
        // on `sandwiches[_index + 1]`. But you can do this:
        sandwiches[_index + 1] = anotherSandwich;
        // ...if you want to copy the changes back into blockchain storage.
      }
    }
    

Don't worry if you don't fully understand when to use which one yet — throughout this tutorial we'll tell you when to use `storage` and when to use `memory`, and the Solidity compiler will also give you warnings to let you know when you should be using one of these keywords.

For now, it's enough to understand that there are cases where you'll need to explicitly declare `storage` or `memory`!

# Put it to the test

It's time to give our zombies the ability to feed and multiply!

When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. We don't want to let someone else feed using our zombie! So first, let's make sure we own this zombie. Add a `require` statement to make sure `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).
    
    > Note: Again, because our answer-checker is primitive, it's expecting `msg.sender` to come first and will mark it wrong if you switch the order. But normally when you're coding, you can use whichever order you prefer — both are correct.

3. We're going to need to get this zombie's DNA. So the next thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). Set this variable to be equal to index `_zombieId` in our `zombies` array.

You should have 4 lines of code so far, including the line with the closing `}`.

We'll continue fleshing out this function in the next chapter!