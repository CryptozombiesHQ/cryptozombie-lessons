---
title: Funciones Públicas y Privadas
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

      function createZombie(string memory _name, uint _dna) public {
      zombies.push(Zombie(_name, _dna));
      }

      }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string memory _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      }
---

En Solidity, las funciones son públicas `public` por defecto. Esto significa que cualquiera (o cualquier otro contrato) puede llamarla y ejecutar su código.

Obviamente no es algo que queremos que pase siempre, y de hecho ésto puede hacer vulnerables tus contratos. Por lo tanto es una buena práctica marcar tus funciones como privadas `private` y solamente hacer públicas `public` aquellas que queramos exponer al mundo exterior.

Vamos a ver como se declara una función privada:

    uint[] numbers;
    
    function _addToArray(uint _number) private {
      numbers.push(_number);
    }
    

Esto significa que solo otras funciones dentro de tu contrato podrán llamar a esta función y añadir al array `numbers`.

Como puedes ver, usamos la palabra clave `private` después del nombre de la función. Y de las misma forma que con los parámetros de funciones, la convención es nombrar las funciones privadas empezando con una barra baja (`_`).

# Vamos a probarlo

Nuestro contrato tiene una función `createZombie` que es pública por defecto, esto significa ¡que cualquiera podría llamarlo y crear un nuevo zombi en nuestro contrato! Vamos a hacerla privada.

1. Modifica la función `createZombie` para que sea una función privada. ¡No te olvides de la convención del nombre!