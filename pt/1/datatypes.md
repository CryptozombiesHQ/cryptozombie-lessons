---
title: Variáveis de Estado & Inteiros
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // comece aqui

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Bom trabalho! Agora que temos a casca para os nossos contratos, vamos aprender sobre como trabalhar com variáveis em Solidity.

**_Variáveis de Estado_** são permanentemente gravadas no armazenamento do contrato. Isso quer dizer que são escritas na blockchain do Ethereum. Pense nelas como escrever em um banco de dados.

##### Exemplo:
```
contract Example {
  // Isto vai ser gravado permanentemente na blockchain
  uint myUnsignedInteger = 100;
}
```

Neste exemplo de contrato, nós criamos uma variável `uint` chamada `myUnsignedInteger` e determinamos o valor igual a 100.

## Inteiros Sem Sinal: `uint`

O tipo de dado `uint` é um número inteiro sem sinal, isso significa que **este valor não pode ser negativo**. Também há um tipo de dado `int` para números inteiros com sinal de negativo.

> Nota: Em Solidity, `uint` é na verdade um apelido para o tipo `uint256`, um número inteiro sem sinal de 256-bits. Você pode declarar uints com menos bits - `uint8`, `uint16`, `uint32`, etc.. Mas em geral você quer simplesmente usar `uint` exceto em casos específicos, algo de que iremos falar mais tarde.

# Vamos testar

Nosso DNA Zumbi vai ser determinado por um número de 16-dígitos.

Declare um `uint` chamado `dnaDigits`, e atribua-lhe o valor `16`.
