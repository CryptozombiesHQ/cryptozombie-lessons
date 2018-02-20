---
titulo: Declaraciones de funciones
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
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

Una declaracion de funcion en solidity se parece a la siguiente:

```
function eatHamburgers(string _name, uint _amount) {

}
```
Esta es una funcion llamada `eatHamburgers` la cual toma dos parametros: una `string`y una `uint`. Por ahora el cuerpo de la funcion esta vacia.


> Nota: Es convencional (pero no requerido) comenzar el nombre variable de la funcion parametro con un underscore (`_`) a manera de diferenciarlos de las variables globales. Utilizaremos esta convencion a lo largo del tutorial.

Usted llamará a esta funcion de esta manera:

```
eatHamburgers("vitalik", 100);
```

# Pongamoslo a prueba

En nuestra aplicacion, vamos a necesitar ser capaces de crear algunos zombies. Vamos a crear una funcion para eso.

1. Crear una funcion llamada `createZombie`. Debe tomar dos parametros: **__nombre_** (a `string`), and **__ADN_** (a `uint`).

Dejaremos el cuerpo vacio por ahora — lo llenaremos luego.
