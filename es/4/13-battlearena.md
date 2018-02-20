---
t�tulo: La arena de batalla
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

En la lecci�n 1, creamos una funci�n que lleva un nombre, lo usa para generar un zombie aleatorio, y agrega al zombie a la base de datos de zombies de nuestra aplicaci�n en la blockchain.

En la lecci�n 2, vamos a hacer que nuestra aplicaci�n sea lo mas parecida a un juego: Vamos a hacerlo multijugador, y adem�s agregaremos una manera mas divertida de crear zombies en lugar de solo generarlos al azar.

�C�mo vamos a crear nuevos zombies? Haciendo que nuestros zombies se "alimenten" de otras formas de vida!

## Alimentando a los Zombie

Cuando un zombie se alimenta, infecta al huesped con un virus. El virus luego convierte al huesped en un nuevo zombie que se une a tu ejercito. El ADN del nuevo zombie se calcular� a partir del ADN del zombie anterior y el ADN del huesped.

�Y con qu� es que a nuestros zombies les gusta alimentarse m�s?

Para descubrirlo... Tendras que terminar la lecci�n 2!

# Pongamoslo a prueba

Hay una demostraci�n simple de alimentaci�n a la derecha. �Haga clic en el humano para ver que ocurre cuando tu zombie se alimenta!

Usted puede ver que el ADN del nuevo zombie esta determinado por el ADN del zombie original, asi como el ADN del huesped.

Cuando este listo, haga clic en "Siguiente cap�tulo" para continuar, y comencemos haciendo que nuestro juego sea multijugador.
