---
title: Funciones Privadas / Funciones Publicas
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

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

      }
---

En Solidity, las funciones son `public` por defecto. Esto significa que cualquierane (o cualquier otro contrato) puede llamar a tu funcion contrato y ejecutar su codigo.

Obviamente esto no es siempre deseable, y puede hacer tu contrato vulnerable a los ataques. Por lo tanto es buena practica marcar tus funciones como `privates` por defecto, y despues solo hacer `publicas` las funciones que usted desee publicar al mundo.

Vamos a ver como declarar funciones privadas:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```

Esto significa que solo otras funciones dentro de nuestro contracto podran llamar a esa funcion y anadirle al arreglo de `numbers`.

Como puede ver, utilizamos la frase `private` despues del nombre de la funcion. Y como con la funciones parametros, es convencion comenzar el nombre de la funcion privada con un underscore (`_`).

# Pongamoslo a prueba

En nuestro contrato la funcion `createZombie` esta actualmente publica por defecto — esto significa que cualquiera podria llamar y crear un nuevo Zombie en nuestro contrato! Vamos a hacerlo privado.

1. Modificar `createZombie` para que sea una funcion privada. No olvide la convecion para nombrarla!
