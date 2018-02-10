---
title: Resumen de la Lección
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

En la Lección 1 vas a construir una "Fabrica de Zombis" para poder crear tu ejército de zombis.

* Nuestra fábrica mantendrá una base de datos de todos los zombis en nuestro ejército
* Nuestra fábrica tendrá una función que cree nuevos zombis
* Cada zombi tendrá una apariencia aleatoria y no habrá dos iguales

En las siguientes lecciones añadiremos más funcionalidades, ¡como la capacidad de atacar humanos u otros zombis! Pero antes de que lleguemos allí tendremos que contar con la funcionalidad de crear nuevos zombis.

## Cómo funciona el ADN de los Zombis

La apariencia del zombi esta basada en el ADN del Zombi. El ADN del Zombi es sencillo, es un número de 16 dígitos, como este:

```
8356281049284737
```

Al igual que el ADN de verdad, las diferentes partes de este número están ligadas a los diferentes rasgos del Zombi. Los dos primeros dígitos indican el tipo de cabeza, los 2 siguientes son para los ojos etc.

> Nota: Para este tutorial mantendremos las cosas sencillas, y nuestros zombis solo tendrán 7 tipos distintos de cabezas (aunque podríamos tener 100 con dos dígitos). Más tarde añadiremos más tipos de cabeza para poder aumentar el número posible de variantes de zombis.

En el ejemplo de arriba, los dos primeros dígitos del ADN son `84`. Para mapearlo al tipo de cabeza hacemos una división módulo 7 y añadimos uno, `83 % 7 + 1` = 7. Así el zombi tendrá el séptimo tipo de cabeza.

Usando el panel de la derecha mueve la barra del `Gen Cabeza` hasta la cabeza 7 (la que tiene el gorro de Santa Claus) para así ver que trazo corresponde con él.

# Vamos a probarlo

1. Juega con las barras de desplazamiento de la derecha de la página. Experimenta para ver como diferentes valores corresponden con diferentes aspectos del zombi.

Ok, ya hemos jugado bastante. Cuando estés listo para continuar ¡dale a "Capítulo Siguiente" abajo para comenzar a aprender Solidity!