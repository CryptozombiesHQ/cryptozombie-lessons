---
title: Empaquetando todo
actions: ['checkAnswer', 'hints']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

¡Eso es, has completado la lección 2!

Ahora puede probar nuestra demostración a la derecha para verlo en acción. Sigue adelante, sé que no puedes esperar hasta el final de esta página 😉. Clica en un gato para atacar, y ¡mira que nuevo gato zombi consigues!

## Implementación JavaScript

Una vez estemos listos para implementar este contrato en Ethereum solamente tendremos que compilar e implementar `ZombieFeeding` — debido a que este contrato es nuestro contrato final que hereda de `ZombieFactory`, y tiene acceso a todos los métodos públicos de ambos contratos.

Vamos a ver un ejemplo de cómo interactuaría nuestro contrato implementado usando JavaScript y web3.js:

```
var abi = /* abi generado por el compilador */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* la dirección Ethereum de nuestro contrato despues de la implementación */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Asumiendo que tenemos la ID de nuestro zombi y la ID del gato que queremos atacar
let zombieId = 1;
let kittyId = 1;

// Para conseguir la imagen del CryptoKitty, necesitamos hacer una consulta a su API.
// Esta información no está guardada en la blockchain, solo en su servidor web.
// Si todo se guardase en la blockchain, no nos tendríamos que preocupar
// si el servidor se cae (apaga), si cambian la API, o si la compañía 
// nos bloquea la carga de imágenes si no les gusta nuestro juego de zombis ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // haz algo para enseñar la imagen
})

// When the user clicks on a kitty:
$(".kittyImage").click(function(e) {
  // Llama al método `feedOnKitty` de tu contrato
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Escuchamos el evento del NewZombie de nuestro contrato para que podamos mostrarlo:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Esta función mostrará el zombi, como en la lección 1:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# ¡Pruébalo!

Selecciona el gato del que te quieres alimentar. ¡El ADN de tu zombi y el ADN del gato se combinarán, y recibirás un nuevo zombi en tu ejército!

¿Puedes ver esas bonitas piernas de gato en tu zombi? Esos son nuestros últimos dígitos `99` del ADN en marcha 😉
 
Puedes volver a empezar y probar de nuevo si quieres. Cuando consigas un gato zombi con el que estés contento (solo te puedes quedar uno), ¡sigue adelante y procede al siguiente capítulo para terminar la lección 2!
