---
title: ADN del Zombi
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;
        
        import "./zombiefactory.sol";
        
        contract ZombieFeeding is ZombieFactory {
        
        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        // iniciar aquí
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
      function feedAndMultiply(uint _zombieId, uint _targetDna) public { require(msg.sender == zombieToOwner[_zombieId]); Zombie storage myZombie = zombies[_zombieId]; _targetDna = _targetDna % dnaModulus; uint newDna = (myZombie.dna + _targetDna) / 2; _createZombie("NoName", newDna); }
      }
---
Vamos a terminar de escribir la función `feedAndMultiply`.

La fórmula para calcular el ADN del nuevo zombi es simple: Es simplemente el promedio entre el ADN del zombi que hemos alimentado y el ADN del zombi objetivo.

Por ejemplo:

    function testDnaSplicing() public {
      uint zombieDna = 2222222222222222;
      uint targetDna = 4444444444444444;
      uint newZombieDna = (zombieDna + targetDna) / 2;
      // ^ será igual a 3333333333333333
    }
    

Más tarde haremos nuestra fórmula más complicada si queremos, añadiéndole por ejemplo algún valor aleatorio al nuevo ADN. Pero por el momento vamos a dejarlo simple — siempre podemos volver a ello más adelante.

# Vamos a probarlo

1. Primero necesitamos estar seguro que el `_targetDna` no es mayor de 16 dígitos. Para ello, podemos fijar que el valor de `_targetDna` sea igual a `_targetDna % dnaModulus` para que únicamente guarde los últimos 16 dígitos.

2. Después nuestra función deberá declarar un `uint` llamado `newDna`, y fijarle el valor del promedio entre el ADN de `myZombie` y el ADN de `_targetDna` (como en el ejemplo de arriba).
    
    > Note: You can access the properties of `myZombie` using `myZombie.name` and `myZombie.dna`

3. Once we have the new DNA, let's call `_createZombie`. You can look at the `zombiefactory.sol` tab if you forget which parameters this function needs to call it. Note that it requires a name, so let's set our new zombie's name to `"NoName"` for now — we can write a function to change zombies' names later.

> Note: For you Solidity whizzes, you may notice a problem with our code here! Don't worry, we'll fix this in the next chapter ;)