---
title: Resumen de la Lección
actions:
  - 'comprobarRespuesta'
  - 'pistas'
skipCheckAnswer: verdadero
material:
  saveZombie: falso
  zombieResult:
    hideNameField: verdadero
    ignoreZombieCache: verdadero
    answer: 1
---
En la Lección 1 vas a construir una "Fabrica de Zombis" para poder crear tu ejército de zombis.

* Nuestra fábrica mantendrá una base de datos de todos los zombis en nuestro ejército
* Nuestra fábrica tendrá una función que cree nuevos zombis
* Cada zombi tendrá una apariencia aleatoria y no habrá dos iguales

En las siguientes lecciones añadiremos más funcionalidades, ¡como la capacidad de atacar humanos u otros zombis! Pero antes de que lleguemos allí tendremos que contar con la funcionalidad de crear nuevos zombis.

## Comó funciona el ADN de los Zombi

La apariencia del zombi esta basada en el ADN del Zombi. El ADN del Zombi es sencillo, es un número de 16 dígitos, como este:

    8356281049284737
    

Al igual que el ADN de verdad, las diferentes partes de este número están ligadas a los diferentes rasgos del Zombi. Los dos primeros dígitos indican el tipo de cabeza, los 2 siguientes son para los ojos etc.

> Nota: Para este tutorial mantendremos las cosas sencillas, y nuestros zombis solo tendrán 7 tipos distintos de cabezas (aunque podríamos tener 100 con dos dígitos). Más tarde añadiremos más tipos de cabeza para poder aumentar el número posible de variantes de zombis.

En el ejemplo de arriba, los dos primeros dígitos del ADN son `83`. Para mapearlo al tipo de cabeza hacemos una división módulo 7 y añadimos uno, `83 % 7 + 1` = 7. Así el zombi tendrá el séptimo tipo de cabeza.

In the panel to the right, go ahead and move the `head gene` slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to.

# Put it to the test

1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance.

Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity!