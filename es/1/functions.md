---
title: Declaración de Funciones
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

Esta es una función llamada `eatHamburgers` que toma dos parámetros: una cadena de texto (`string`) y un número entero sin signo `uint`. Por ahora dejamos el cuerpo de la función vacio. Tenga en cuenta que estamos especificando la visibilidad de la función como `public`. También estamos proporcionando instrucciones sobre dónde debe almacenarse la variable `_name` en `memory`. Esto es necesario para todos los tipos de referencia, tales como arrays, strings, mappings y strings.

¿Te preguntarás qué es un tipo de referencia?

Bueno, hay dos maneras en que se puede pasar un argumento a una función de Solidity:

- Por valor, lo que significa que el compilador de Solidity crea una nueva copia del valor del parámetro y lo pasa a su función. Esto permite que su función modifique el valor sin preocuparse de que el valor del parámetro inicial sea cambiado.
- Por referencia, lo que significa que tu función es llamada con una... referencia a la variable original. Por lo tanto, si su función cambia el valor de la variable que recibe, el valor de la variable original se cambia.

> Nota: la convención (no obligatoria) es llamar los parámetros de las funciones con nombres que empiezan con un subrayado (`_`) para de esta forma diferenciarlos de variables globales. Utilizaremos esta convención en este tutorial.

Y llamaríamos a esta función de esta forma:

```
```

# Ponlo a prueba

En nuestra aplicación, vamos a necesitar poder crear unos cuantos zombis. Creemos una función para ello.

1. Crea una función 'public' llamada `createZombie`. Debería tomar dos parámetros **\_name** (un `string`), y **\_dna** (un número entero sin signo `uint`). No te olvides de pasar el primer argumento por valor usando la palabra clave `memory`

Dejemos el cuerpo de la función vacio por ahora, lo rellenaremos más tarde.
