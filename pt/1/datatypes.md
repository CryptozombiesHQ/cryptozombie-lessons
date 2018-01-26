---
title: Variáveis de Estado & Inteiros (State Variables & Integers)
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //comece aqui

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Bom trabalho! Agora que nós temos a casca para os nossos contratos, vamos aprender sobre como trabalhar com variáveis em Solidity.

**_State variables_** (Variáveis de estado) são permanentemente gravadas no storage do contrato. Isso signífica que são escritas na blockchain do Ethereum. Pense nelas como escrever em um banco de dados.

##### Exemplo:
```
contract Example {
  // Isto vai ser gravado permanentemente na blockchain
  uint myUnsignedInteger = 100;
}
```

Neste exemplo de contract, nos criamos uma variável `uint` chamada `myUnsignedInteger` e determinamos o valor igual a 100.

## Inteiros sem sinal: `uint`

O tipo de dado `uint` é um inteiro sem sinal, isso significa que **que este valor não pode ser negativo**. Também há um tipo de dado `int` para inteiros com sinal de negativo.

> Nota: Em Solidity, `uint` é na verdade um apelido para o tipo `uint256`, um inteiro sem sinal de 256-bits. Você pode declarar uints com menos bits - `uint8`, `uint16`, `uint32`, etc.. Mas em geral você pode simplesmente usar `uint` exeto em casos específicos, algo que vamos falar mais tarde.

# Vamos testar

Nosso DNA Zumbi vai ser deteterminado por um número 16-dígitos.

Declare um `uint` chamado `dnaDigits`, e defina-o igual a `16`.
