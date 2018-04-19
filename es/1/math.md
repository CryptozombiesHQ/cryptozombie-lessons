---
title: Operaciones Matemáticas
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          // empieza aquí

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Las matemáticas de Solidity son bastante básicas. Las siguientes operaciones son las mismas en prácticamente todos los lenguajes de programación:

* Suma: `x + y`
* Resta: `x - y`,
* Multiplicación: `x * y`
* División: `x / y`
* Módulo: `x % y` _(por ejemplo, `13 % 5` es `3`, ya que al dividir 13 entre 5, 3 es el resto)_

Solidity también tiene un **_operador exponencial_** (por ejemplo "x elevado a y", x^y):

```
uint x = 5 ** 2; // es igual a 5^2 = 25
```

# Vamos a probarlo

Para asegurarnos de que el ADN de nuestro Zombi tiene solo 16 dígitos, creemos un número entero sin signo igual a 10^16 y usémoslo para calcular el módulo cualquiera.

1. Crea una variable de tipo `uint` llamada `dnaModulus`, y dale el valor de **10 elevado a `dnaDigits`**.
