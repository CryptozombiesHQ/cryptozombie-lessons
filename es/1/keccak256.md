---
title: Keccak256 and Typecasting
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

          function _generateRandomDna(string _str) private view returns (uint) {
              // start here
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Nosotros queremos que nuestra funcion `_generateRandomDna` nos regrese un `uint` al azar(semi). Como podemos lograr esto?

Ethereum tiene la funcion Hash `keccak256` disenada internamente, la cual es una version de SHA3. Una funcion hash basicamente mapea una entrada de strings hacia un numero hexadecimal de 256-bit. Un pequeno cambio en el string causara un gran cambio en el hash.

Es util para muchos propositos en Ethereum, pero por ahora vamos a solo usarlo para la generacion de numeros pseudo al azar.

Ejemplo:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Como se puede observar, los valores retornados son totalmente distintos a pesar de solo haber cambiado 1 caracter en la entrada.

> Nota: La generacion de numeros al azar **Secure** es un problema muy dificil en Blockchain. Nuestro metodo aqui es inseguro, pero como la seguridad no es la principal prioridad para nuestro ADN Zombie, esto sera lo suficientemente bueno para nuestros propositos.

## Conversion de tipos

A veces usted necesita convertir entre tipos de datos. Tome el siguiente ejemplo:

```
uint8 a = 5;
uint b = 6;
// throws an error because a * b returns a uint, not uint8:
uint8 c = a * b; 
// we have to typecast b as a uint8 to make it work:
uint8 c = a * uint8(b); 
```

En lo anterior, `a * b` devuelve` uint`, pero intentamos almacenarlo como `uint8`, lo que podria causar potenciales problemas. Al convertirlo en `uint8`, funciona y el compilador no lanzara un error.

# Pongamoslo a prueba

Completemos el cuerpo de nuestra funcion! `_generateRandomDna` Esto es lo que deberia hacer:

1. La primera linea del codigo debe tomar el hash `keccak256` de `_str` para generar un hexadecimal pseudo-aleatorio, encasillarlo como `uint`, y finalmente almacenar el resultado en un `uint` llamdo `rand`.

2. Queremos que nuestro ADN tenga solo 16 digitos de largo (recuerda nuestro `dnaModulus`?). Entonces la segunda linea del codigo debería `return` el modulo de valor anterior (`%`) `dnaModulus`.
