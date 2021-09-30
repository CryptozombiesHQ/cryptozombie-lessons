---
title: Más sobre Funciones
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.25;

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

          // empieza aquí

      }
    answer: >
      pragma solidity ^0.4.25;


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

En este capítulo aprenderemos sobre los **_valores de retorno_** de una función, y sobre modificadores de funciones.

## Valores de Retorno

Para devolver un valor desde una función, la declaración es la siguiente:

```
string greeting = "Qué tal viejo!";

function sayHello() public returns (string) {
  return greeting;
}
```

En Solidity, la declaración de la función contiene al final tipo de dato del valor de retorno (en nuestro caso `string`).

## Modificadores de Función

La función de arriba no cambia el estado en Solidity, esto es que no cambia ningún valor o escribe nada.

En este caso podríamos declararla como función **_view_**, que significa que solo puede ver los datos pero no modificarlos:

```
function sayHello() public view returns (string) {
```

Solidity también contiene funciones **_pure_**, que significa que ni siquiera accedes a los datos de la aplicación. Por ejemplo:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Esta función no lee desde el estado de la aplicación - el valor devuelto depende por completo de los parámetros que le pasemos. En este caso deberíamos declarar la función como **_pure_**.

> Nota: No siempre es fácil recordar marcar una función como pure o view, por suerte el compilador de Solidity es muy bueno avisándonos de cuándo debemos usar estos modificadores de función.

# Vamos a probarlo

Necesitaremos una función que nos ayude a generar un número aleatorio para el ADN a partir de una cadena de texto.

1. Crear una función `private` que se llame `_generatePseudoRandomDna`. Recibirá un parámetro llamado `_str` (de tipo `string`), y devolverá un `uint`.

2. Esta función tendrá que ver algunas de las variables de nuestro contrato, pero no modificará ninguna, así que la marcaremos como `view`.

3. El cuerpo de la función debería estar vacio por ahora, lo rellenaremos más tarde.
