---
Capítulo: La arena de batalla
actions: ['checkAnswer', 'hints']
material:
  saveZombie: false
  battleArena:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---

En la lección 1, creamos una función que lleva un nombre, lo usa para generar un zombie aleatorio, y agrega al zombie a la base de datos de zombies de nuestra aplicación en la blockchain.

En la lección 2, vamos a hacer que nuestra aplicación sea lo más parecida a un juego: Vamos a hacerlo multijugador, y además agregaremos una manera más divertida de crear zombies en lugar de solo generarlos al azar.

¿Cómo vamos a crear nuevos zombies? ¡Haciendo que nuestros zombies se "alimenten" de otras formas de vida!

## Alimentando a los Zombie

Cuando un zombie se alimenta, infecta al huésped con un virus. El virus luego convierte al huésped en un nuevo zombie que se une a tu ejército. El ADN del nuevo zombie se calculará a partir del ADN del zombie anterior y el ADN del huésped.

¿Y con qué es que a nuestros zombies les gusta alimentarse más?

¡Para descubrirlo... Tendrás que terminar la lección 2!

# Pongámoslo a prueba

Hay una demostración simple de alimentación a la derecha. ¡Haga clic en el humano para ver que ocurre cuando tu zombie se alimenta!

Usted puede ver que el ADN del nuevo zombie está determinado por el ADN del zombie original, así como el ADN del huésped.

Cuando esté listo, haga clic en "Siguiente capítulo" para continuar, y comencemos haciendo que nuestro juego sea multijugador.
