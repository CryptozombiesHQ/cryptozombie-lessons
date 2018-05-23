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
    

## Versión Pragma

Todo el código fuente en Solidity debería empezar con una declaración "version pragma" de la versión del compilador que debe de usarse para ese código. Esto previene problemas con versiones futuras del compilador que podrían no ser compatibles y fallar en tu código.

Esta declaración se asemeja a esto: `pragma solidity ^0.4.19;` (para usar la última versión del compilador de Solidity actual, la 0.4.19).

Poniendo todo junto, este es el esqueleto de como se empieza un contrato — lo primero que escribirás cada vez que empieces un nuevo proyecto:

    pragma solidity ^0.4.19;
    
    contract HolaMundo {
    
    }
    

# Vamos a probarlo

Para empezar a crear tu ejército de Zombis, vamos a crear un contrato base llamado `ZombieFactory`.

1. In the box to the right, make it so our contract uses solidity version `0.4.19`.

2. Create an empty contract called `ZombieFactory`.

When you're finished, click "check answer" below. If you get stuck, you can click "hint".