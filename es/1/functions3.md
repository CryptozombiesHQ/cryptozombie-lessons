---
title: Más sobre Funciones
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
      uint dnaModulus = 10 ** dnaDigits;

      struct Zombie {
      string name;
      uint dna;
      }

      Zombie[] public zombies;

      function _createZombie(string memory _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }

      // start here

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string memory _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string memory _str) private view returns (uint) {
      }
      }
---

In this chapter, we're going to learn about function ***return values***, and function modifiers.

## Valores de Retorno

Para devolver un valor desde una función, la declaración es la siguiente:

    string greeting = "What's up dog";
    
    function sayHello() public returns (string memory) {
      return greeting;
    }
    

En Solidity, la declaración de la función contiene el tipo de dato del valor de retorno (en nuestro caso `string`).

## Modificadores de Función

La función de arriba no cambia el estado en Solidity, esto es que no cambia ningún valor o escribe nada.

En este caso podríamos declararla como función ***view*** que significa que solo puede ver los datos pero no modificarlos:

    function sayHello() public view returns (string memory) {
    

Solidity también contiene funciones ***pure***, que significa que ni siquiera puedes acceder a los datos de la aplicación. Por ejemplo:

    function _multiply(uint a, uint b) private pure returns (uint) {
      return a * b;
    }
    

Esta función no lee desde el estado de la aplicación - el valor devuelto depende por completo de los parámetros que le pasemos. En este caso deberíamos declarar la función como ***pure***.

> Nota: No siempre es fácil recordar marcar una función como pure o view, por suerte el compilador de Solidity es muy bueno avisándonos de cuándo debemos usar estos modificadores de función.

# Vamos a probarlo

Necesitaremos una función que nos ayude a generar un número aleatorio para el ADN a partir de una cadena de texto (string).

1. Create a `private` function called `_generateRandomDna`. It will take one parameter named `_str` (a `string`), and return a `uint`. Don't forget to set the data location of the `_str` parameter to `memory`.

2. Esta función tendrá que ver algunas de las variables de nuestro contrato, pero no modificará ninguna, así que la marcaremos como `view`.

3. El cuerpo de la función debería estar vacio por ahora, lo rellenaremos más tarde.