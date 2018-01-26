---
title: "Contratos (Contracts)"
actions: ['verificarResposta', 'dicas']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Crie seu contract aqui
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Começando pelo básico do básico:

O código em Solidity é encapsulado em **contracts**. Um `contract` é um bloco de construção fundamental para aplicações em Ethereum — todas as variáveis e funções pertencem a um contract, e este será o ponto de início de todos os seus projetos.

Um contract vazio com o nome `HelloWorld` seria assim:

```
contract HelloWorld {

}
```

## Versão Pragma

Todo código fonte em solidity deve começar com um "version pragma" - uma declaração da versão do compilador Solidity que deve ser usado. Isso é para evitar problemas com um futuras versões do compilador, potencialmente apresentando mudanças que quebrariam seu código.

Irá ficar assim: `pragma solidity ^0.4.19;` (para a última versão do solidity no momento que foi escrito, 0.4.19).

Juntando tudo, a versão mais simples para começar um contract - a primeira coisa que você vai escrever toda vez que começar um novo projeto.

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Vamos testar

Para começar nosso exército Zombie, vamos criar um contrato base chamado `ZombieFactory`.

1. Na caixa a direita, crie o nosso contract usando a versão de solidity `0.4.19`.

2. Crie um contrato vazio chamado `ZombieFactory`.

Quando você terminar, clique em "verificar resposta" abaixo. Se você ficar "bloqueado", você pode clicar em "dicas".
