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

          function _generateRandomDna(string _str) private view returns (uint) {

          }

      }
---

Neste capítulo nós vamos aprender sobre funções que **_retornam valores_**, e sobre modificadores de funções.

## Retornar valores

Para retornar um valor de uma função, a declaração deve ser assim:

```
string greeting = "Olá cachorro!";

function sayHello() public returns (string) {
  return greeting;
}
```

Em Solidity, a declaração da função contém o tipo do valor de retorno (neste caso uma `string`).

## Modificadores de funções

Na verdade a função acima não altera algum estado em Solidity - em outras palavras não altera qualquer valor ou escrever qualquer coisa.

Neste caso nós podemos declará-la como uma função **_view_** (observa), que significa: somente uma observação do dado, mas nenhuma alteração de fato.

```
function sayHello() public view returns (string) {
```

Em Solidity também existem funções **_pure_** (pura), que significa que nenhum dado será acessado na aplicação. Pense na seguinte situação:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Esta função nem mesmo lê um estado da aplicação - os seus valores retornados dependem somente dos parâmetros da função. Então neste caso nós podemos declarar a função como **_pure_** (pura).

> Nota: Pode ser complicado de lembrar quando marcar a função como pure/view (pura/observação). Para nossa sorte o compilador de Solidity faz um bom trabalho em nos avisar quando devemos usar algum desses modificadores.

# Vamos testar

Nós vamos precisar de uma função de ajuda para gerar números de DNA aleatórios de uma string.

1. Crie uma função `private` chamada `_generateRandomDna`. Que receberá um parâmetro chamado `_str` (uma `string`), e retorna um `uint`.

2. Esta função irá observar algumas das nossas variáveis no contrato, mas não irá modificá-las, então marque as mesmas como `view`.

3. O corpo da função deve ficar vázio por enquanto - nós vamos trabalhar em isto mais tarde.
