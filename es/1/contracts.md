---
title: Contratos
actions:
  - ""
  - ""
requireLogin: true
material:
  editor:
    language: ""
    startingCode: |2
       Poner la versión de Solidity aquí

      //2. Crea un contrato aquí
    answer: ""
---

Empecemos con lo más fundamental:

El código Solidity está encapsulado en **contratos**. Un `contrato` (contract) es el bloque de construcción más básico de las aplicaciones de Ethereum — todas las variables y las funciones pertenecen a un contrato, y este será el punto de partida de todos tus proyectos.

Un contrato vacio llamado `HolaMundo` se parecería a esto:

```
contract HolaMundo {

}
```

## Versión Pragma

Todo el código fuente en Solidity debería empezar con una declaración "version pragma" de la versión del compilador que debe de usarse para ese código. Esto previene problemas con versiones futuras del compilador que podrían no ser compatibles y fallar con tu código.

Para el alcance de este tutorial, queremos poder compilar nuestros contratos inteligentes con cualquier versión del compilador en el rango de 0. .0 (inclusive) a 0.6.0 (exclusivo).
Esta declaración se asemeja a esto: `pragma solidity >=0.5.0 <0.6.0;`.

Poniendo todo junto, este es el esqueleto de como se empieza un contrato — lo primero que escribirás cada vez que empieces un nuevo proyecto:

```
pragma solidity >=0.5.0 <0.6.0;

contract HolaMundo {

}
```

# Ponlo a prueba

Para empezar a crear tu ejército de Zombis, vamos a crear un contrato base llamado `ZombieFactory` (Fábrica de Zombis).

1. En la caja de la derecha, haz lo necesario para que el contrato use la versión de Solidity `>=0.5.0 <0.6.0`.

2. Crea un contrato vacio que se llame `ZombieFactory`.

Cuando hayas terminado, haz clic en "comprobar respuesta" abajo. Si te quedas atascado, haz clic en "pistas".
