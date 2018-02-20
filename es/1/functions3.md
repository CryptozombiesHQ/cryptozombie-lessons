---
title: Mas de Funciones
actions: ['checkAnswer', 'hints']
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

          // start here

      }
    answer: >
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

          function _generateRandomDna(string _str) private view returns (uint) {

          }

      }
---

En este capitulo, vamos a aprender acerca de la Funcion **_return values_**, y la funcion modificador.

## Devolver Valores

Para devolver un valor de una funcion, la declaracion se ve como esto:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

En Solidity, la funcion declaracion contiene el tipo del valor retornado (en este caso `string`).

## Funcion modificador

La funcion anterior no cambia en realidad el estado en Solidity — por ejemplo no cambia ningun valor ni escribe algo.

Asi que en este caso nosotros podriamos declararla como una funcion de **_vista_**, lo que quiere decir que solo para ver la data mas no para modificarla:

```
function sayHello() public view returns (string) {
```

Solidity tambien contiene funciones **_puras_**, lo que significa que no se esta accesando a ninguna informacion en la aplicacion. Consideremos lo siguiente:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Esta funcion nisiquiera lee del estado de la aplicacion — retorna valores que dependen solamente de los parametros de la funcion. Asi que en este caso vamos a declarar esta funcion como **_pura_**.

> Nota: Puede ser dificil recordar cuando marcar una funcion como pura/vista. Por suerte el compilador de Solidity es bueno dandonos advertencias que nos permiten conocer cuando uno deberia usar uno de estos modificadores.

# Pongamoslo a prueba

Vamos a querer una funcion ayudante que genere un numero de ADN a azar proveniente de un string.

1. Cree una funcion `private` llamada `_generateRandomDna`. Esto tomara un parametro llamado `_str` (una `string`), y devolvera una `uint`.

2. Esta funcion vera algunas variables de contrato pero no las modificara, asi que la marcaremos como `view`.

3. El cuerpo de la funcion deberia estar vacio hasta este puento — luego lo llenaremos.
