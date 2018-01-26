---
title: Operações Matemáticas
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // comece aqui

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Matemática em Solidity é bem fácil. As seguintes operações são as mesmas na maioria das linguagens de programação:

* Adição: `x + y`
* Subtração: `x - y`,
* Multiplicação: `x * y`
* Divisão: `x / y`
* Módulo / Resto: `x % y` _(por exemplo, `13 % 5` é `3`, porque se você dividir 5 por 13, 3 é o resto)_

Solidity também suporta um **_operador exponêncial_** (exemplo: "x elevado a potência de y", x^y):

```
uint x = 5 ** 2; // o memso que 5^2 = 25
```

# Vamos testar

Para ter certeza que o nosso DNA Zumbi é somente de 16 caracteres, vamos criar outro `uint` igual o valor de 10^16. Desta meneira mais tarde podemos usar o operador de módulo `%` para encurtar um inteiro para 16 dígitos.

1. Crie um `uint` chamado `dnaModulus`, e defina-o igual a **10 elevado a potência de `dnaDigits`**
