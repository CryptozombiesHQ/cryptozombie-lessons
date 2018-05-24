---
title: Más sobre Funciones
actions:
  - 'comprobarRespuesta'
  - 'pistas'
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
      
      // Iniciar aquí
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) {
      }
      }
---
En este capítulo aprenderemos sobre los ***valores de retorno*** de una función, y sobre modificadores de funciones.

## Valores de Retorno

Para devolver un valor desde una función, la declaración es la siguiente:

    string greeting = "Que tal viejo";
    
    function sayHello() public returns (string) {
      return greeting;
    }
    

En Solidity, la declaración de la función contiene el tipo de dato del valor de retorno (en nuestro caso `string`).

## Modificadores de Función

La función de arriba no cambia el estado en Solidity, esto es que no cambia ningún valor o escribe nada.

En este caso podríamos declararla como función ***view*** que significa que solo puede ver los datos pero no modificarlos:

    function sayHello() public view returns (string) {
    

Solidity also contains ***pure*** functions, which means you're not even accessing any data in the app. Consider the following:

    function _multiply(uint a, uint b) private pure returns (uint) {
      return a * b;
    }
    

This function doesn't even read from the state of the app — its return value depends only on its function parameters. So in this case we would declare the function as ***pure***.

> Note: It may be hard to remember when to mark functions as pure/view. Luckily the Solidity compiler is good about issuing warnings to let you know when you should use one of these modifiers.

# Put it to the test

We're going to want a helper function that generates a random DNA number from a string.

1. Create a `private` function called `_generateRandomDna`. It will take one parameter named `_str` (a `string`), and return a `uint`.

2. This function will view some of our contract's variables but not modify them, so mark it as `view`.

3. The function body should be empty at this point — we'll fill it in later.