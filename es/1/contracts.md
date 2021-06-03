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
      pragma solidity >=0.5.0 <0.6.0;

      contract ZombieFactory {
      }
---

Empecemos con lo más fundamental:

El código Solidity está encapsulado en **contratos**. Un `contract` (contrato) es el bloque de construcción fundamental de las aplicaciones de Ethereum — todas las variables y las funciones pertenecen a un contrato, y este será el punto de partida de todos tus proyectos.

Un contrato vacío llamado `HelloWorld` se asemejaría a esto:

    contract HelloWorld {
    
    }
    

## Versión Pragma

Todo el código fuente en Solidity debería empezar con una declaración "version pragma" de la versión del compilador que debe de usarse para ese código. Esto previene problemas con versiones futuras del compilador que podrían no ser compatibles y fallar en tu código.

For the scope of this tutorial, we'll want to be able to compile our smart contracts with any compiler version in the range of 0.5.0 (inclusive) to 0.6.0 (exclusive). It looks like this: `pragma solidity >=0.5.0 <0.6.0;`.

Poniendo todo junto, este es el esqueleto de como se empieza un contrato — lo primero que escribirás cada vez que empieces un nuevo proyecto:

    pragma solidity >=0.5.0 <0.6.0;
    
    contract HelloWorld {
    
    }
    

# Vamos a probarlo

Para empezar a crear tu ejército de Zombis, vamos a crear un contrato base llamado `ZombieFactory`.

1. In the box to the right, make it so our contract uses solidity version `>=0.5.0 <0.6.0`.

2. Crea un contrato vacío llamado `ZombieFactory`.

Cuando hayas terminado, haz clic en "comprobar respuesta" abajo. Si te quedas atascado, haz clic en "pistas".