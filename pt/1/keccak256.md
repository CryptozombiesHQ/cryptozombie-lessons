---
title: Keccak256 e Conversão de Tipos
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
              // comece aqui
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Nós queremos que a nossa função `_generatePseudoRandomDna` retorne um (semi) aleatório `uint`. Como podemos fazer isso ?

Ethereum tem uma função de hash `keccak256` interna, que é uma versão do SHA3. Uma função hash basicamente transforma uma string de entrada em um número hexadecimal aleatório de 256-bits. Qualquer pequena mudança na `string` irá causar uma total mudança em sua hash.

É muito útil em diversos casos no Ethereum, mas por enquanto vamos usar somente para a geração de um número pseudo-aleatório.

Exemplo:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");

//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Como você pode ver, os valores retornados são totalmente diferentes mesmo com a mudança de somente um caractere de entrada.

> Nota: Geração de números aleatórios de forma **segura** em um blockchain é um problema muito difícil. Nosso método aqui utilizado é inseguro, mas desde que a segurança não é a nossa prioridade principal para o nosso DNA zumbi, será o suficiente para o nosso propósito.

## Conversão de Tipos

Algumas vezes você precisa converter tipos diferentes. Pegue por exemplo o seguinte:

```
uint8 a = 5;
uint b = 6;

// lança um erro, porque a * b retorna um uint, não um uint8:
uint8 c = a * b;

// nós temos de converter b em uint8 para isso funcionar:
uint8 c = a * uint8(b); 
```

Logo acima, `a * b` retorna um `uint`, mas nós estamos tentando guardar o seu valor em um `uint8`, que potencialmente pode causar problemas. Ao converter-lo como um `uint8`, a conversão irá funcionar e o compilador não irá reclamar.

# Vamos testar

Vamos preencher o corpo da nossa função `_generatePseudoRandomDna`!
O que deve ser feito é:

1. Na primeira linha de código, pegue o hash de `_str` utilizando a função `keccak256` gerando um hexadecimal pseudo-aleatório, converta-o em um `uint`, e finalmente guarde o resultado em um `uint` chamado `rand`.

2. Nós queremos somente 16 dígitos de tamanho em nosso DNA (lembra do `dnaModulus`?). Então a segunda linha de código deve retornar `return` o módulo do valor acima (`%`) `dnaModulus`.
