---
title: "title:Título\nactions: acciones\n0: chequear respuesta\n1: consejos\nmaterial:\neditor:\nlenguage: sol\nComenzarCódigo: pragma solidity //1. Introduce la versión de solidity aquí //2. Crear contrato aquí\nRespuesta:solidity pragma^`0.4.9.; contrato ZombieFactory{}\nComenzando por lo más básico:\nEl código Solidity está encapsulado en contratos. Un \"contract\" es el bloque fundamental para construir aplicaciones en Ethereum - todas las \"variables\" y \"funciones\" pertenecen a un contrato y este será el punto de partida de todos sus proyectos.\nUn contrato \"vacío\" que le llamaremos \"HelloWorld\" se representaría así:\ncontract HelloWord{\n}\nVersión Pragma\nTodo el código fuente del lenguaje Solidity debe comenzar con una \"versión pragma\", los programas en Solidity se utilizan para especificar ciertas condiciones bajo las cuales el archivo fuente puede o no ejecutarse. La versión pragma especifica en qué versión de Solidity puede trabajar un archivo fuente. Es decir, es una declaración de la versión del compilador de Solidity que debe usar dicho código. Esto se utiliza para evitar problemas con futuras versiones del compilador que pudieran introducir cambios que podrían romper el código.\nLa manera de presentarlo sería: pragma solidity ^0.4.19; (esta anotación pertenece a la última versión de Solidity en el momento de traducir este documento o.4.19).\nUniendo el contrato \"vacío\" que indicamos al inicio y la declaración que todo código fuente en el lenguaje Solidity debe de usar nos permite construir un contrato inicial básico, el cual lo desarrollaríamos como sigue:\npragma solidity ^0.4.19;\nContract HelloWorld{\n}\nEsta forma de construir un contrato nos servirá para comenzar cada nuevo proyecto.\nPonlo a prueba\nPara comenzar a crear nuestro ejército Zombie, creemos un contrato base llamado ZombieFactory.\nEn el cuadro a la derecha, haga que nuestro contrato utilice la versión de solidez 0.4.19.\nCrea un contrato vacío llamado ZombieFactory.\nCuando hayas terminado, haz clic en \"verificar respuesta\" a continuación. Si te quedas atascado, puedes hacer clic en \"pista\"."
actions:
  - 'checkAnswer'
  - 'hints'
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
Starting with the absolute basics:

Solidity's code is encapsulated in **contracts**. A `contract` is the fundamental building block of Ethereum applications — all variables and functions belong to a contract, and this will be the starting point of all your projects.

An empty contract named `HelloWorld` would look like this:

    contract HelloWorld {
    
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