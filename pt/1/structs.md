---
title: Estruturas
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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

      }
---

Algumas vezes você precisa de um tipo de dado mais complexo. Para isso, Solidity fornece **_structs_**:

```
struct Person {
  uint age;
  string name;
}

```

Estruturas permitem que você crie tipos de dados mais complicados que tem múltiplas propriedades.

> Note que nos apresentamos um novo tipo de dado, `string`. Strings são de tamanho arbitrário de dados UTF-8. Ex. `string greeting = "Hello world!"`

# Vamos testar

Em nossa aplicação, nós queremos criar alguns zumbis! E zumbis terão múltiplas propriedades, esse é o caso perfeito para usarmos estruturas.

1. Criar uma `struct` chamada `Zombie`.

2. Nossa estrutura `Zombie` terá 2 propriedades: `name` (uma `string`), e `dna` (um `uint`).
