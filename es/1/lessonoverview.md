---
titulo: Resumen de la Leccion
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

En la Leccion 1, vamos a construir una "Fabrica de Zombies" para construir un ejercito de zombies.

* Nuestra fabrica mantendrá una base de datos de todos los zombies de nuestro ejercito
* Nuestra fabrica tendrá una funcion para crear nuevos zombies
* Cada zombie tendrá una apariencia aleatoria y unica 

En lecciones siguientes, agregaremos mas funcionalidades, como darle a los zombies la capacidad de atacar humanos u otros zombies! Pero antes de llegar ahi, tenemos que agregar la funcionalidad basica de crear nuevos zombies.

## Como funciona el ADN Zombie

La apariencia del zombie se basará en su "ADN Zombie". ADN Zombie es simple — es un entero de 16 digitos, como:

```
8356281049284737
```

Al igual que el ADN real, diferentes partes de este numero se asignaran a diferentes caracteristicas. Los primeros 2 digitos se le asignaran al tipo de cabeza del zombie the zombie's head type, los segundos 2 digitos a los ojos del zombie, etc.

> Nota: Para este tutorial, hemos mantenido las cosasa simples, y nuestros zombies pueden tener solo 7 diferentes tipos de cabeza (aunque 2 digitos permiten 100 posibles opciones). Mas tarde podriamos agregar mas tipos de cabeza si quisieramos aumentar el numero de variaciones de zombies.

Por ejemplo, los primeros 2 digitos de nuestro ejemplo de ADN anterior son `83`. Para asignar eso al tipo de cabeza de zombie, hacemos `83 % 7 + 1` = 7. Entonces este zombie tendria 7 tipos de cabeza. 

En el panel de la derecha, avance y mueva el control de deslizamiento `head gene` hacia la 7ma cabeza (el sombrero de Santa) para ver a que rasgo le corresponderia el `83`.

# Pongamoslo a prueba

1. Juega con los controles de deslizamiento en el lado derecho de la pagina. Experimenta para ver como diferentes valores numericos corresponden a diferentes aspectos de la apariencia del zombie.

Ok, suficiente jugando. Cuando este listo para continuar, presione "Siguiente Capitulo" abajo, y profundicemos en el aprendizaje de Solidity!
