---
title: Web3.js
actions: ['checkAnswer', 'hints']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

¡Nuestro contrato en Solidity está completo! Ahora tenemos que escribir una aplicación de usuario en javascript para interactuar con él.

Ethereum tiene una librería Javascript llamada **_Web3.js_**.

En lecciones posteriores veremos en detalle como publicar un contrato y como configurar Web3.js. Pero por ahora vamos solamente a ver un ejemplo de código de cómo Web3.js interactuaría con nuestro contrato.

No te preocupes si esto no tiene mucho sentido para tí todavía.

```
// Así es como accederiamos a nuestro contrato:
var abi = /* abi generado por el compilador */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* nuestra dirección del contrato en Ethereum después de implementarlo */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` ha accedido a las funciones y eventos públicos de nuestro contrato

// algunos eventos están escuchando para recoger el valor del texto:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Llama a la función `createPseudoRandomZombie` de nuestro contrato:
  ZombieFactory.createPseudoRandomZombie(name)
})

// Escucha al evento de `NewZombie`, y actualiza la interfaz
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// Recogemos el adn del zombi y actualizamos nuestra imagen
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // rellenamos el ADN con ceros si es menor de 16 caracteres
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // los primeros 2 dígitos hacen la cabeza. Tenemos 7 posibles cabezas, entonces hacemos % 7
    // para obtener un número entre 0 - 6, después le sumamos 1 para hacerlo entre 1 - 7. Tenemos 7
    // imagenes llamadas desde "head1.png" hasta "head7.png" que cargamos en base a 
    // este número:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // Los siguientes 2 dígitos se refieren a los ojos, 11 variaciones:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variaciones de camisetas:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // los últimos 6 digitos controlas el color. Actualiza el filtro CSS: hue-rotate
    // que tiene 360 grados:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```
Lo que nuestro código javascript hace es recoger los valores generados en `zombieDetails` más arriba, y usar un poco de magia Javascript en el navegador (usamos Vue.js) para intercambiar las imágenes y aplicar filtros CSS. Te daremos todo el código para hacer esto en una lección posterior.

# ¡Pruébalo!

¡Adelante, escribe tu nombre en la caja de la derecha y mira a ver que tipo de zombi recibes!

**Una vez que tengas un zombi con el que estés contento, haz clic en "Capítulo Siguiente" para guardarlo y completar la Lección 1**
