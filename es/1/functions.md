---
title: Declaración de Funciones
actions:
  - checkAnswer
  - hints
requireLogin: true
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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Una declaración de una función en Solidity se asemeja a esto:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Esta es una función llamada `eatHamburgers` que toma dos parámetros: una cadena de texto (`string`) y un número entero sin signo `uint`. Por ahora dejamos el cuerpo de la función vacio. Note that we're specifying the function visibility as `public`. We're also providing instructions about where the `_name` variable should be stored- in `memory`. This is required for all reference types such as arrays, structs, mappings, and strings.

What is a reference type you ask?

Vamos a probarlo

- By value, which means that the Solidity compiler creates a new copy of the parameter's value and passes it to your function. This allows your function to modify the value without worrying that the value of the initial parameter gets changed.
- By reference, which means that your function is called with a... reference to the original variable. Thus, if your function changes the value of the variable it receives, the value of the original variable gets changed.

> Nota: la convención (no obligatoria) es llamar los parámetros de las funciones con nombres que empiezan con un subrayado (`_`) para de esta forma diferenciarlos de variables globales. Utilizaremos esta convención en este tutorial.

Y llamaríamos a esta función de esta forma:

```
eatHamburgers("vitalik", 100);
```

# Put it to the test

En nuestra aplicación, vamos a necesitar poder crear unos cuantos zombis. Creemos una función para ello.

1. Crear una función llamada `createZombie`. Debería tomar dos parámetros **\_name** (un `string`), y **\_dna** (un número entero sin signo `uint`). Don't forget to pass the first argument by value by using the `memory` keyword

Dejemos el cuerpo de la función vacio por ahora, lo rellenaremos más tarde.
