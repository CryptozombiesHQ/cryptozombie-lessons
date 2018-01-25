---
title: Declarações de Funções
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
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // comece aqui

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

Uma declaração de função em solidity parece o seguinte:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Esta é uma declaração de uma função chamada `eatHamburgers` que recebe dois parâmetros: uma `string` e um `uint`. Por enquanto o corpo da função esta vazio.

> Nota: É uma convenção (mas não é requerido) iniciar os nomes das variáveis nos parâmetros das funções com sublinhado para diferenciá-los de variáveis globais. Nós iremos usar isso como convenção em todo o nosso tutorial.

Você chamaria essa função assim:

```
eatHamburgers("vitalik", 100);
```

# Vamos testar

Em nossa aplicação, nós vamos precisar criar alguns zumbis. Vamos criar a função para isso:

1. Crie uma função chamada `createZombie`. Tal deve receber dois argumentos: **__name_** (uma `string`), e **__data_** (uma `uint`).

Deixe o corpo da função vazia por enquanto - nós vamos preenchê-lo mais tarde.
