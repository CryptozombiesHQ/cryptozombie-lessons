---
title: Contratos
actions: ['verificarResposta', 'dicas']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      // 2. Crie seu contract aqui
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Começando pelo básico do básico:

O código em Solidity é encapsulado em **contratos**. Um `contract` (contrato) é um bloco de construção fundamental para aplicações em Ethereum — todas as variáveis e funções pertencem a um `contract`, e este será o ponto inicial de todos os seus projetos.

Um `contract` vazio com o nome `HelloWorld` seria assim:

```
contract HelloWorld {

}
```

## Versão Pragma

Todo código fonte em Solidity deve começar com um "version pragma" - uma declaração da versão do compilador Solidity que deve ser usado. Isto é para evitar problemas com futuras versões do compilador, potencialmente apresentando mudanças que possam quebrar o seu código.

Irá ficar assim: `pragma solidity ^0.4.19;` (para a última versão do Solidity no momento que essa lição foi escrita, 0.4.19).

Juntando tudo, a versão mais simples para começar um `contract` - aqui vai a primeira coisa que você vai escrever toda vez que começar um novo projeto.

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Vamos testar

Para começar o nosso exército Zumbi, vamos criar um contrato base chamado `ZombieFactory`.

1. Na caixa a direita, crie o nosso `contract` usando a versão do Solidity `0.4.19`.

2. Crie um `contract` vazio chamado `ZombieFactory`.

Quando você terminar, clique em "Verificar Resposta" abaixo. Se você não souber como progredir, você pode clicar em "Dicas".
