---
title: Mais Sobre Funções
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

          }

      }
---

Neste capítulo vamos aprender sobre funções que **_retornam valores_**, e sobre modificadores de funções.

## Retornando Valores

Para retornar o valor de uma função, a declaração deve ser assim:

```
string greeting = "Olá cachorro!";

function sayHello() public returns (string) {
  return greeting;
}
```

Em Solidity, a declaração da função contém o tipo do valor de retorno (neste caso uma `string`).

## Modificadores das Funções

Na verdade a função acima não altera estado algum em Solidity - em outras palavras não altera qualquer valor ou escreve qualquer coisa.

Neste caso nós podemos declará-la como uma função com palavra reservada `view` (observa), que significa: somente uma observação do dado, mas nenhuma alteração de fato.

```
function sayHello() public view returns (string) {
```

Em Solidity também existem funções **puras** usando a palavra reservada `pure`, que significa que nenhum dado será acessado na aplicação. Pense na seguinte situação:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Esta função nem mesmo lê um estado da aplicação - os seus valores retornados dependem somente dos parâmetros da função. Então neste caso nós podemos declarar a função como **_pura_** usando a palavra reservada `pure`.

> Nota: Pode ser um tanto quanto complicado lembrar quando marcar a função como pura/observação (pure/view). Para a nossa sorte o compilador de Solidity faz um bom trabalho em avisar-nos quando devemos usar algum desses modificadores.

# Vamos testar

Nós vamos precisar de uma função de ajuda para gerar números de DNA aleatórios de uma string.

1. Crie uma função `private` chamada `_generatePseudoRandomDna`. Que receberá um parâmetro chamado `_str` (uma `string`), e retorna um `uint`.

2. Esta função irá observar algumas das nossas variáveis no contrato, mas não irá modificá-las, então marque-a como `view`.

3. O corpo da função deve ficar vazio por enquanto - iremos trabalhar nisto mais tarde.
