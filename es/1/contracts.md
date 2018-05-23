---
title: "Contratos"
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Coloca la versión de solidity aquí
      
      //2. Crear el contrato aquí
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      }
---
Empecemos con lo más fundamental:

El código Solidity está encapsulado en **contratos**. Un `contrato` es el bloque de construcción fundamental de las aplicaciones de Ethereum — todas las variables y las funciones pertenecen a un contrato, y este será el punto de partida de todos tus proyectos.

Un contrato vacío llamado `HolaMundo` se asemejaría a esto:

    contract HolaMundo {
    
    }
    

## Version Pragma

All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use. This is to prevent issues with future compiler versions potentially introducing changes that would break your code.

It looks like this: `pragma solidity ^0.4.19;` (for the latest solidity version at the time of this writing, 0.4.19).

Putting it together, here is a bare-bones starting contract — the first thing you'll write every time you start a new project:

    pragma solidity ^0.4.19;
    
    contract HelloWorld {
    
    }
    

# Put it to the test

To start creating our Zombie army, let's create a base contract called `ZombieFactory`.

1. In the box to the right, make it so our contract uses solidity version `0.4.19`.

2. Create an empty contract called `ZombieFactory`.

When you're finished, click "check answer" below. If you get stuck, you can click "hint".