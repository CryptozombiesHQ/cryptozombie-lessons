---
title: Resumen de la Lección 2
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  saveZombie: falso
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: verdadero
    ignoreZombieCache: verdadero
    answer: 1
---
En la lección 1, creamos una función que recibía un nombre, lo usaba para generar un zombi aleatorio, y lo añadía a la base de datos de zombis de nuestra app guardada en la blockchain.

En la Lección 2, vamos a hacer nuestra app más parecida a un juego: Vamos a hacerlo multijugador, y tambén añadiremos más diversión a la creación de zombis en vez de crearlos aleatoriamente.

¿Cómo crearemos nuevos zombis? ¡Haciendo que nuestros zombis se "alimenten" de otras formas de vida!

## Alimentando a los Zombis

Cuando un zombi se alimenta, infecta al anfitrión con un virus. El virus convierte al anfitrión en un nuevo zombi que se une a tu ejército. El nuevo ADN del zombi estará calculado del ADN del anterior zombi y del ADN del anfitrión.

¿Y qué es lo que más les gusta a nuestros zombis para alimentarse?

Para averiguarlo... ¡Tendrás que completar la lección 2!

# Vamos a probarlo

A la derecha tenemos una demostración simple de la alimentación. ¡Haz clic en un humano para ver que pasa cuando tu zombi se alimenta!

Puedes ver como el ADN del nuevo zombi está determinado por el ADN del zombi original, así como del ADN del anfitrión.

When you're ready, click "Next chapter" to move on, and let's get started by making our game multi-player.