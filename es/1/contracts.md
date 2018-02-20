---
titulo: "Contratos"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Create contract here
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Comenzando con lo basico absoluto:

El codigo de Solidity es encapsulado en **contract**. Un `contract` es el componente fundamental de las aplicaciones de Ethereum — todas las variables y funciones pertenecen a un contrato, y este sería el punto de partida de todos sus proyectos.

Un contrato vacio llamado `HelloWorld` se veria asi:

```
contract HelloWorld {

}
```

## Version Pragma

Toda el codigo fuente de Solidity debe comenzar con un "version pragma" — una declaracion de la version del compilador de Solidity que debe usar este codigo. Esto es para evitar problemas con futuras versiones del compilador que puedan potencialmente introducir cambios que podrian romper su codigo.


Esto se veria asi: `pragma solidity ^0.4.19;` (para la ultima version de solidity al momento de escribir esto, 0.4.19).

Poniendo todo junto, aqui hay un contrato inicial basico — lo primero que usted escribira cada vez que comience un nuevo proyecto:

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Pongamoslo a prueba

Para comenzar a crear nuestro ejército Zombie, creemos un contrato base llamado `ZombieFactory`.

1. En el cuadro a la derecha, haga que nuestro contrato use la versión `0.4.19` de solidity.

2. Crea un contrato vacío llamado `ZombieFactory`.

Cuando haya terminado, haz clic abajo en "verificar respuesta". Si se queda atascado, puede hacer clic en "pista".