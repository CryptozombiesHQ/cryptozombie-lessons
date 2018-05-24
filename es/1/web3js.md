---
title: Web3.js
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  saveZombie: verdadero
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: verdadero
    answer: 1
---
¡Nuestro contrato en Solidity está completo! Ahora tenemos que escribir una aplicación de usuario en javascript para interactuar con él.

Ethereum tiene una librería Javascript llamada ***Web3.js***.

En lecciones posteriores veremos en detalle como publicar un contrato y como configurar Web3.js. Pero por ahora vamos solamente a ver un ejemplo de código de cómo Web3.js interactuaría con nuestro contrato.

No te preocupes si esto no tiene mucho sentido todavía.

    //Así es como accederiamos a nuestro contrato:
    var abi = /* abi generado por el compilador */
    var ZombieFactoryContract = web3.eth.contract(abi)
    var contractAddress = /* nuestra dirección del contrato en Ethereum después de implementarlo */
    var ZombieFactory = ZombieFactoryContract.at(contractAddress)
    // `ZombieFactory` ha accedido a las funciones y eventos públicos de nuestro contrato
    
    // algunos eventos están escuchando para recoger el valor del texto:
    $("#ourButton").click(function(e) {
      var name = $("#nameInput").val()
      // Llama a la función`createRandomZombie` de nuestro contrato:
      ZombieFactory.createRandomZombie(name)
    })
    
    // Escucha al evento de `NewZombie` event, y actualiza la interfaz
    var event = ZombieFactory.NewZombie(function(error, result) {
      if (error) return
      generateZombie(result.zombieId, result.name, result.dna)
    })
    
    // recogemos el adn del zombi y actualizamos nuestra imagen
    function generateZombie(id, name, dna) {
      let dnaStr = String(dna)
      // rellenamos el ADN con ceros si es menor de 16 caracteres
      while (dnaStr.length < 16)
        dnaStr = "0" + dnaStr
    
      let zombieDetails = {
        // los primeros dos dígitos hacen la cabeza. We have 7 possible heads, so % 7
        // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
        // image files named "head1.png" through "head7.png" we load based on
        // this number:
        headChoice: dnaStr.substring(0, 2) % 7 + 1,
        // 2nd 2 digits make up the eyes, 11 variations:
        eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
        // 6 variations of shirts:
        shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
        // last 6 digits control color. Updated using CSS filter: hue-rotate
        // which has 360 degrees:
        skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
        eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
        clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
        zombieName: name,
        zombieDescription: "A Level 1 CryptoZombie",
      }
      return zombieDetails
    }
    

What our javascript then does is take the values generated in `zombieDetails` above, and use some browser-based javascript magic (we're using Vue.js) to swap out the images and apply CSS filters. You'll get all the code for this in a later lesson.

# Give it a try!

Go ahead — type in your name to the box on the right, and see what kind of zombie you get!

**Once you have a zombie you're happy with, go ahead and click "Next Chapter" below to save your zombie and complete lesson 1!**