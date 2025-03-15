---
title: Herança
actions: ['verificarResposta', 'dicas']
requireLogin: true
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

      // Comece aqui

    answer: >
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

      contract ZombieFeeding is ZombieFactory {

      }

---

O código do nosso jogo está ficando um tanto grande. Ao invés de fazer um contrato extremamente grande, as vezes faz mais sentido separar as lógicas em vários contratos para organizar o código.

Umas característica que torna o Solidity mais gerenciável é a **_herança_** de contrato:

```
contract Doge {
  function catchphrase() public returns (string memory) {
    return "Um papai CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string memory) {
    return "Um lindo BabyDoge";
  }
}
```

`BabyDoge` **_herda_** de `Doge`. Isso significa que se você compilar e implantar `BabyDoge`, ele terá acesso a ambas `catchphrase()` e `anotherCatchphrase()` (e qualquer outra função pública que nós podemos definir em `Doge`).

Isto pode ser útil para uma herança lógica (assim como uma sub classe, um `Cat` é um `Animal`). Mas também pode ser usado para uma simples organização em seu código ao agrupar lógicas similares juntas em diferentes classes.

# Vamos testar

Nos próximos capítulos, nós iremos implementar as funcionalidades para os nosso zumbis se alimentarem e multiplicarem. Vamos colocar esta lógica em sua própria classe que herda os métodos de `ZombieFactory`.

1. Crie um contrato chamado `ZombieFeeding` abaixo do contrato `ZombieFactory`. Este contrato deve herdar nosso contrato `ZombieFactory`.
