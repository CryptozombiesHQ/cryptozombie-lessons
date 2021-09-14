---
title: Empaquetandolo todo
actions:
  - 'comprobarRespuesta'
  - 'pistas'
material:
  saveZombie: verdadero
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: falso
    hideSliders: verdadero
    answer: 1
---

¡Eso es, has completado la lección 2!

You can check out the demo to the right to see it in action. Go ahead, I know you can't wait until the bottom of this page 

## JavaScript implementation

Una vez estemos listos para implementar este contrato en Ethereum solamente tendremos que compilar e implementar `ZombieFeeding` — debido a que este contrato es nuestro contrato final que hereda de `ZombieFactory`, y tiene acceso a todos los métodos públicos de ambos contratos.

Let's look at an example of interacting with our deployed contract using JavaScript and web3.js:

    var abi = /* abi generado por el compilador */
    var ZombieFeedingContract = web3.eth.contract(abi)
    var contractAddress = /* la dirección de nuestro contrato en Ethereum después de la implementación */
    var ZombieFeeding = ZombieFeedingContract.at(contractAddress)
    
    // Asumiendo que tenemos la ID de nuestro zombi y la ID del gato que queremos atacar
    let zombieId = 1;
    let kittyId = 1;
    
    // Para conseguir la imagen del CryptoKitty, necesitamos hacer una consulta a su API. Esta
     // información no está guardada en la blockchain, solo en su servidor web.
    Si todo se guardase en la blockchain, no nos tendríamos que preocupar
    // si el servidor se cae, si cambian la API, o si la compañía 
    // nos bloquea la carga de imágenes si no les gusta nuestro juego de zombis ;)
    let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
    $.get(apiUrl, function(data) {
      let imgUrl = data.image_url
      // haz algo para mostrar la imagen
    })
    
    // Cuando los usuarios hagan clic en una gato:
    $(".kittyImage").click(function(e) {
      // Llama al método`feedOnKitty` de nuestro contrato
      ZombieFeeding.feedOnKitty(zombieId, kittyId)
    })
    
    // Escuchamos el evento del NewZombie de nuestro contrato para que podamos mostrarlo:
    ZombieFactory.NewZombie(function(error, result) {
      if (error) return
      // Esta función mostrará el zombi, como en la lección 1:
      generateZombie(result.zombieId, result.name, result.dna)
    })
    

# ¡Pruébalo!

Selecciona el gato del que te quieres alimentar. ¡El ADN de tu zombi y el ADN del gato se combinarán, y recibirás un nuevo zombi en tu ejército!

Notice those cute cat legs on your new zombie? That's our final `99` digits of DNA at work 

Puedes volver a empezar y probar de nuevo si quieres. Cuando consigas un gato zombi con el que estés contento (solo te puedes quedar uno), ¡sigue adelante y procede al siguiente capítulo para terminar la lección 2!