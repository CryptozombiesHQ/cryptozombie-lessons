---
title: Declarações de Funções
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          // comece aqui

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string memory _name, uint _dna) public {

          }

      }
---

Uma declaração de função em Solidity parece o seguinte:

```
function eatHamburgers(string memory _name, uint _amount) public {

}
```

Esta é uma função chamada `eatHamburgers` que recebe 2 parâmetros: uma `string` e um `uint`. Por enquanto, o corpo da função está vazio. Note que estamos especificando a visibilidade da função como `public`. Também estamos fornecendo instruções sobre onde a variável `_name` deve ser armazenada — na `memory`. Isso é obrigatório para todos os tipos de referência, como arrays, structs, mappings e strings.  

O que é um tipo de referência, você pergunta?  

Bem, existem duas maneiras de passar um argumento para uma função Solidity:  

 * Por valor, o que significa que o compilador Solidity cria uma nova cópia do valor do parâmetro e a passa para sua função. Isso permite que sua função modifique o valor sem se preocupar em alterar o valor do parâmetro original.  
 * Por referência, o que significa que sua função é chamada com uma referência à variável original. Assim, se sua função alterar o valor da variável que recebe, o valor da variável original também será alterado.

> Nota: É uma convenção (mas não é requerido) iniciar os nomes das variáveis nos parâmetros das funções com sublinhado para diferenciá-los de variáveis globais. Nós iremos usar isso como convenção em todo o nosso tutorial.

Você chamaria essa função assim:

```
eatHamburgers("vitalik", 100);
```

# Vamos testar

Em nossa aplicação, nós vamos precisar criar alguns zumbis. Vamos criar a função para isso:

1. Crie uma função `public` chamada `createZombie`. Ela deve receber dois parâmetros: **\_name** (uma `string`) e **\_dna** (um `uint`). Não se esqueça de passar o primeiro argumento por valor usando a palavra-chave `memory`.

Deixe o corpo da função vazia por enquanto - nós vamos preenchê-lo mais tarde.
