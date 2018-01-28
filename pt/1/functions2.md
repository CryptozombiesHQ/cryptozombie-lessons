---
title: Funções Privadas / Públicas
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

      }
---

Em Solidity, funções são públicas por padrão. Isso significa que qualquer um (ou qualquer outro contrato) pode chamar a função em seu contrato e executar seu código.

Obviamente que isso nem sempre é o desejado, e pode tornar o seu contrato vulnerável a ataques. Sendo assim é uma boa prática marcar as suas funções com a palavra reservada `private` (privada) por padrão, e somente marcar com a palavra reservada `public` (pública) as funções que você quer expor para o mundo.

Vejamos como declarar uma função privada:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```

Isso quer dizer que somente as funções em nosso próprio contrato podem chamar a função e adicionar ao array `numbers`.

Como você pode ver, usarmos a palavra reservada `private` após o nome da função. E assim como os parâmetros da função, a convenção é começar os nomes das funções privadas com sublinhado (`_`).

# Vamos testar

No momento a função `createZombie` em nosso contrato é pública por padrão - isso significa que qualquer um pode chamar a função e criar um novo zumbi em nosso contrato! Vamos torná-la privada.

1. Modifique a função `createZombie` para torná-la privada. Não esqueça da convenção de nomes.
