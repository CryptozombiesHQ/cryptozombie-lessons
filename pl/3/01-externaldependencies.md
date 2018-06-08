---
title: Niezmienność Kontraktów (umów)
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
requireLogin: prawda
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
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
        
        // 1. Usuń to:
        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        // 2. Zmień to na deklarację:
        KittyInterface kittyContract = KittyInterface(ckAddress);
        
        // 3. Dodaj tutaj metodę setKittyContractAddress
        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(_species) == keccak256("kitty")) {
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
        ragma solidity ^0.4.19;
        
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
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
        }
        
        }
    answer: >
      pragma solidity ^0.4.19;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      KittyInterface kittyContract;
      function setKittyContractAddress(address _address) external { kittyContract = KittyInterface(_address); }
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(_species) == keccak256("kitty")) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
Do tej pory, Solidity wyglądał całkiem podobnie do innych języków jak np. Javascript. Ale jest kilka rzeczy, które czynią Ethereum DApps odmiennymi od normalnych aplikacji.

Po wdrożeniu umowy do Ethereum, jest ona ***niezmienna***, co oznacza, że nie może już nigdy być zmodyfikowana lub zaktualizowana ponownie.

Początkowy kod, który wdrażasz do umowy zostaje zapisany na stałe w blockchain'ie. Jest to jeden z powodów, który budzi niepokój jeśli chodzi o bezpieczeństwo w Solidity. Więc jeśli Twój kod posiada wady, nie ma sposobu na naprawienie go, np. jakimś patch'em. Możesz jedynie poinformować użytkowników, aby zaczęli używać innego adresu Twojej inteligentnej umowy, takiej która została poprawiona.

Ale jest to także cecha smart kontraktów. Kod jest prawem. Jeśli czytasz kod inteligentnej umowy i weryfikujesz go, możesz być pewien, że przy każdym wywołaniu funkcji będzie robić dokładnie to, co ten kod Ci mówi. Nikt nie może później zmienić takiej funkcji i przynieść nieoczekiwanych rezultatów.

## Zewnętrzne zależności

W lekcji 2, zakodowaliśmy adres kontraktu CryptoKitties do naszej DApp. Lecz co by się stało, jeśli kontrakt CryptoKitties miałby bug'a i ktoś zniszczyłby wszystkie kotki?

Jest mało prawdopodobne, ale jeśli tak by się stało uczyniłoby nasze DApp całkowicie bezużyteczne — DApp mogłyby wskazywać na ustalony adres, który nie zwraca już żadnych kotków. Nasze Zombiaki nie mogłyby żywić się kotkami i nie bylibyśmy w stanie zmodyfikować umowy, aby to naprawić.

Z tego powodu, często warto mieć funkcje, które umożliwiają aktualizację kluczowych części DApp.

For example, instead of hard coding the CryptoKitties contract address into our DApp, we should probably have a `setKittyContractAddress` function that lets us change this address in the future in case something happens to the CryptoKitties contract.

## Put it to the test

Let's update our code from Lesson 2 to be able to change the CryptoKitties contract address.

1. Delete the line of code where we hard-coded `ckAddress`.

2. Change the line where we created `kittyContract` to just declare the variable — i.e. don't set it equal to anything.

3. Create a function called `setKittyContractAddress`. It will take one argument, `_address` (an `address`), and it should be an `external` function.

4. Inside the function, add one line of code that sets `kittyContract` equal to `KittyInterface(_address)`.

> Note: If you notice a security hole with this function, don't worry — we'll fix it in the next chapter ;)