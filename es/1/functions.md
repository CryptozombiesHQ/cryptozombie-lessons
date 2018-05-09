---
title: Declaración de Funciones
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

          // empieza aquí

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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Una declaración de una función en Solidity se asemeja a esto:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Esta es una función llamada `eatHamburgers` que toma dos parámetros: una cadena de texto (`string`) y un número entero sin signo `uint`. Por ahora dejamos el cuerpo de la función vacio.

> Nota: la convención (no obligatoria) es llamar los parámetros de las funciones con nombres que empiezan con un subrayado (`_`) para de esta forma diferenciarlos de variables globales. Utilizaremos esta convención en este tutorial.

Y llamaríamos a esta función de esta forma:

```
eatHamburgers("vitalik", 100);
```

# Vamos a probarlo

En nuestra aplicación, vamos a necesitar poder crear unos cuantos zombis. Creemos una función para ello.

1. Crear una función llamada `createZombie`. Debería tomar dos parámetros **__name_** (un `string`), y **__dna_** (un número entero sin signo `uint`).

Dejemos el cuerpo de la función vacio por ahora, lo rellenaremos más tarde.
