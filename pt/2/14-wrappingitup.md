---
title: Finalizando
actions: ['verificarResposta', 'dicas']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

É isso, você completou a lição 2!

Você pode testar na demo ao lodo direito para ver em ação. Vá em frente, Eu sei que você não pode esperar até o fim desta página 😉. Clique é um gatinho para atacar, e veja o novo gato zumbi que você consegue!

## Implementação em JavaScript

Uma vez que estamos prontos para a implantação do contrato no Ethereum podemos compilar e implantar `ZombieFeeding` - desde que este contrato é o nosso contrato final que herda de `ZombieFactory`, e tem acesso a todos os métodos públicos em ambos os contratos.

Vejamos em um exemplo de interação com nosso contrato implantado usando JavaScript e web3.js:

```
var abi = /* abi gerada pelo compilador */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* endereço do nosso contrato após implantado */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Presumindo que temos nosso ID do zumbi e do ID do gatinho que queremos atacar
let zombieId = 1;
let kittyId = 1;

// Para obter a imagem do CryptoKitty, precisamos pesquisar na API deles.
// Esta informação não é guardada no blockchain, somente no servidor web.
// Se tudo fosse guardado na blockchain, não teríamos que se preocupar
// se o servidor cair, mudanças na API deles, ou mesmo se a empresa
// nos bloqueassem para carregarmos as imagens se caso não gostarem de jogos de zumbi ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // faça algo para mostrar a imagem
})

// Quando o usuário clica no gatinho:
$(".kittyImage").click(function(e) {
  // Chama o método `feedOnKitty` do nosso contrato
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Escuta por evento NewZombie em nosso contrato e então podemos mostrar:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Esta função irá mostrar um novo zumbi, como na lição 1:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Vamos testar!

Escolha um gatinho que você para se alimentar. O DNA do seu zumbi e o DNA do gatinho irão combinar, e você terá um novo zumbi em seu exército!

Veja que pernas de gato fofas no seu zumbi? Esse é o nosso dígito final `99` do DNA em ação 😉

Você pode começar de novo e tentar novamente se quiser. Quando estiver feliz com o seu gato zumbi (você só pode ter um), vá em frente e prossiga para o próximo capítulo para completar a lição 2!
