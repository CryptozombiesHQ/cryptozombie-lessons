---
title: Juntando Tudo
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          // comece aqui

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Nós estamos perto de terminar o nosso gerador aleatório de Zumbi! Vamos criar uma função pública que vai juntar tudo.

Nós vamos criar uma função pública que tem uma entrada, o nome do zumbi, e usa o nome do zumbi para criar um DNA aleatório.

# Vamos testar

1. Crie uma função `public` chamada `createPseudoRandomZombie`. Ela irá ter um parâmetro chamado `_name` (uma `string`). _(Nota: Declare esta função como `public` assim como você declarou as funções anteriores como `private`)_

2. A primeira linha desta função deve executar a função `_generatePseudoRandomDna` usando o parâmetro `_name`, e guardá-lo em um `uint` chamado `randDna`.

3. A segunda linha deve executar a função `_createZombie` e passar os parâmetros `_name` e `randDna`.

4. A solução deve ter 4 linhas de código (incluindo o fechamento da função `}`)
