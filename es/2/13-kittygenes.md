---
title: "Bonus: Genes de Gato"
actions:
  - 'comprobarRespuesta'
  - 'pistas'
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
        
        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);
        
        // Modify function definition here:
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        // Add an if statement here
        _createZombie("NoName", newDna);
        }
        
        function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        // And modify function call here:
        feedAndMultiply(_zombieId, kittyDna);
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
        
        function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
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
      pragma solidity ^0.4.25;
      import "./zombiefactory.sol";
      contract KittyInterface { function getKitty(uint256 _id) external view returns ( bool isGestating, bool isReady, uint256 cooldownIndex, uint256 nextActionAt, uint256 siringWithId, uint256 birthTime, uint256 matronId, uint256 sireId, uint256 generation, uint256 genes ); }
      contract ZombieFeeding is ZombieFactory {
      address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d; KittyInterface kittyContract = KittyInterface(ckAddress);
      function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) { newDna = newDna - newDna % 100 + 99; } _createZombie("NoName", newDna); }
      function feedOnKitty(uint _zombieId, uint _kittyId) public { uint kittyDna; (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId); feedAndMultiply(_zombieId, kittyDna, "kitty"); }
      }
---
La lógica de nuestra función está ahora completa... pero vamos a añadir una característica extra.

Vamos a hacer que los zombis creados a partir de gatos tengan una única característica que muestre que son gato-zombis.

Para hacer esto, debemos añadir algo de código del gato en el ADN del zombi.

Si recuerdas la lección 1, estamos solo usando los primeros 12 dígitos de los 16 dígitos que determinan el ADN de la apariencia de un zombi. Así que vamos a usar los últimos 2 dígitos para manejar esas características "especiales".

Diremos que los gato-zombis tienen `99` en los últimos dos dígitos de su ADN (debido a que tienen 9 vidas). Entonces en nuestro código, diremos que si `if` un zombi viene de un gato, los últimos dos dígitos de su ADN serán `99`.

## Declaraciones if

Una declaración if en Solidity es igual que en javascript:

    function eatBLT(string sandwich) public {
      // Remember with strings, we have to compare their keccak256 hashes
      // to check equality
      if (keccak256(abi.encodePacked(sandwich)) == keccak256(abi.encodePacked("BLT"))) {
        eat();
      }
    }
    

# Vamos a probarlo

Vamos a implementar los genes de los gatos en nuestro código del zombi.

1. Primero, vamos a cambiar la definición de la función `feedAndMultiply` para que reciba un tercer argumento: un `string` llamado `_species`

2. Next, after we calculate the new zombie's DNA, let's add an `if` statement comparing the `keccak256` hashes of `_species` and the string `"kitty"`. We can't directly pass strings to `keccak256`. Instead, we will pass `abi.encodePacked(_species)` as an argument on the left side and `abi.encodePacked("kitty")` as an argument on the right side.

3. Dentro de la sentencia `if`, queremos reemplazar los últimos 2 dígitos del ADN con `99`. Una manera de hacer esto es usando la lógica: `newDna = newDna - newDna % 100 + 99;`.
    
    > Explicación: Supongamos que `newDna` es `334455`. Entonces `newDna % 100` es `55`, así que `newDna - newDna % 100` es `334400`. Finalmente añadimos `99` para obtener `334499`.

4. Para terminar, necesitamos cambiar la llamada de la función dentro de `feedOnKitty`. Cuando llama a `feedAndMultiply`, añade el parámetro `"kitty"` al final.