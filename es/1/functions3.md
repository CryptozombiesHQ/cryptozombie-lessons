---
title: Más sobre Funciones
actions:
  - ""
  - ""
requireLogin: true
material:
  editor:
    language: ""
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
    answer: |
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

          function _generateRandomDna(string _str) private view returns (uint) {

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

En Solidez, la declaración de función contiene el tipo de valor de retorno (en este caso `string`).

## Modificadores de Funciones

La función anterior no cambia realmente el estado en Solidity — por ejemplo, no cambia ningún valor ni escribe nada.

En este caso podríamos declararla como función **_view_**, que significa que solo puede ver los datos pero no modificarlos:

```
function sayHello() public view returns (string) {
```

La solidez también contiene funciones **_pure_**, lo que significa que ni siquiera estás accediendo a ningún dato en la aplicación. Considera lo siguiente:

```
```

Esta función no lee desde el estado de la aplicación - el valor devuelto depende por completo de los parámetros que le pasemos. En este caso deberíamos declarar la función como **_pure_**.

> Nota: Puede ser difícil recordar cuándo marcar funciones como pure o view. Por suerte, el compilador Solidity es bueno para emitir advertencias para hacerle saber cuándo debe usar uno de estos modificadores.

# Ponlo a prueba

Necesitaremos una función que nos ayude a generar un número aleatorio para el ADN a partir de una cadena de texto.

1. Crear una función `private` que se llame `_generateRandomDna`. Recibirá un parámetro llamado `_str` (de tipo `string`), y devolverá un `uint`. No olvides establecer la ubicación de datos del parámetro `_str` a `memory`.

2. Esta función tendrá que ver algunas de las variables de nuestro contrato, pero no modificará ninguna, así que la marcaremos como `view`.

3. El cuerpo de la función debería estar vacio por ahora, lo rellenaremos más tarde.
