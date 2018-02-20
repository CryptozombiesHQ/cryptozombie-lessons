---
title: Operaciones Matematicas
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

      }

---

Las matematicas en Solidity son muy sencillas. Las siguientes operaciones son las mismas que en la mayoria de los lenguajes de programacion:

* Suma: `x + y`
* Resta: `x - y`,
* Multiplicacion: `x * y`
* Division: `x / y`
* Modulo / residuo: `x % y` _(por ejemplo, `13 % 5` es `3`, porque si usted divide 5 entre 13, 3 es el residuo)_

Solidity tambien es compatible con un **_operator exponencial_** (por ejemplo "x a la potencia de y", x^y):

```
uint x = 5 ** 2; // equal to 5^2 = 25
```

# Pongamoslo a prueba

Para asegurarnos que el de ADN nuestro Zombie tiene solo de 16 caracteres, hagamos otro `uint` igual a 10^16. De esta forma podemos usar luego el operador de modulo `%` para acortar un entero a 16 digitos.

1. Cree un `uint` llamado `dnaModulus`, y establecerlo igual a **10 a la potencia de `dnaDigits`**.
