---
title: Web3.js
actions: ['verificarResposta', 'dicas']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

Nosso contrato em Solidity esta completo! Agora nós vamos escrever o frontend  em JavaScript que interage com o contrato.

Ethereum possui uma biblioteca  em JavaScript chamada **_Web3.js_**.

Nas lições mais à frente, iremos nos aprofundar em como implantar um contrato e configurar a Web3.js. Mas por enquanto vamos somente ver uma amostra de um código de como a Web3.js irá interagir com um contrato já implantado (deployed).

Não se preocupe se isso ainda não faz sentido.

```
// Como iremos acessar o contrato:
var abi = /* abi gerada pelo compilador */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* endereço do nosso contrato após implantado */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` tem acesso as funções públicas e eventos em nosso contrato

// um tipo de ouvinte para o evento que pega o texto de entrada:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Executa a função em nosso contrato `createPseudoRandomZombie`:
  ZombieFactory.createPseudoRandomZombie(name)
})

// Ouve por um evento `NewZombie`, e atualiza a interface UI
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// obtém o dna Zumbi e atualiza a nossa imagem
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // preenche o DNA com zeros a esquerda se for menor que 16 caracteres
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // os primeiros 2 dígitos fazem a cabeça, nós temos 7 possíveis cabeças, então % 7
    // para conseguir um número 0 - 6, então adicionamos 1 para fazer 1 - 7, então nós temos 7
    // os arquivos de imagens chamam-se "head1.png" até "head7.png" nós carregamos
    // baseados neste número:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // os segundos 2 dígitos fazer os olhos com 11 variações:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variações de camisas:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // os últimos 6 dígitos controlam a cor. Atualizando o filtro CCS: hue-rotate
    // que tem 360 graus:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "CryptoZombie nível 1",
  }
  return zombieDetails
}
```

O que o nosso JavaScript faz é pegar os valores gerados em `zombieDetails` acima, e os usa em um tipo de aplicação mágica no navegador (estamos usando Vue.js) para mudar as imagens e aplicar os filtros CSS. Você terá acesso a todo o código em futuras lições.

# Tente também!

Vá em frente - escreva o seu nome na caixa a direita, e veja o tipo de zumbi que você terá!

**Assim que você ter um zumbi e ser feliz, vá em frente e clique "Next Chapter" (Próximo Capítulo) abaixo para salvar o seu zumbi e completar a lição 1!**
