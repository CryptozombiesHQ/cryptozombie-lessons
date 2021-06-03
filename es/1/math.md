---
title: Operaciones Matemáticas
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {

      uint dnaDigits = 16;
      //start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      }
---

Las matemáticas de Solidity son bastante básicas. Las siguientes operaciones son las mismas que en la mayoría de los lenguajes de programación:

* Suma: `x + y`
* Resta: `x - y`,
* Multiplicación: `x * y`
* División: `x / y`
* Módulo / residuo: `x % y` *(por ejemplo, `13 % 5` es `3`, ya que al dividir 13 entre 5, 3 es el residuo)*

Solidity también tiene un ***operador exponencial*** (por ejemplo "x elevado a y", x^y):

    uint x = 5 ** 2; // es igual a 5^2 = 25
    

# Vamos a probarlo

Para asegurarnos de que el ADN de nuestro Zombi tiene solo 16 dígitos, vamos a crear un `uint` igual a 10^16. De esa manera podemos utilizar el módulo operador `%` para acortar un número entero a 16 dígitos.

1. Crea un `uint` llamado `dnaModulus`, y dale el valor de **10 elevado a `dnaDigits`**.