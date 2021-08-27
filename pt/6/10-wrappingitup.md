---
title: Juntando tudo
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  saveZombie: false
  zombieDeck:
    zombie:
      lesson: 6
    hideSliders: true
    answer: 1
---

Parabéns! Você escreveu com sucesso seu primeiro front-end Web3.js que interage com seu smart contract.

Como recompensa, você tem o seu próprio zumbi `The Phantom of Web3`! Nível 3.0 (para Web 3.0 😉), completo com máscara de raposa. Confira ele para a direita.

## Próximos passos

Esta lição foi intencionalmente básica. Queríamos mostrar a lógica principal de que você precisaria para interagir com seu smart contract, mas não queríamos gastar muito tempo para fazer uma implementação completa, já que a parte Web3.js do código é bastante repetitiva , e nós não estaríamos introduzindo novos conceitos, fazendo esta lição por mais tempo.

Então, deixamos esta implementação básica. Aqui está uma lista de idéias para as coisas que gostaríamos de implementar, a fim de tornar o nosso front-end uma implementação completa para o nosso jogo de zumbis, se você quer continuar com isso e construí-lo por conta própria:

1. Implementando funções para `attack`, `changeName`, `changeDna`, e as funções ERC721 `transfer`, `ownerOf`, `balanceOf`, etc. A implementação destas funções seria idêntica a todas as outras `send` transações que cobrimos.

2. Implementando uma "página admin" onde você pode executar o `setKittyContractAddress`, `setLevelUpFee` e `withdraw`. Novamente, não há lógica especial no front-end aqui — essas implementações seriam idênticas às funções que já cobrimos. Você teria que se certificar de que você os chamou do mesmo endereço do Ethereum que implementou o contrato, já que eles têm o modificador `onlyOwner`.

3. Existem algumas visualizações diferentes no aplicativo que gostaríamos de implementar:

  a. Uma página de zumbis individual, onde você pode ver informações sobre um zumbi específico com um permalink para ele. Esta página renderiza a aparência do zumbi, mostra seu nome, seu dono (com um link para a página de perfil do usuário), sua contagem de ganhos/perdas, seu histórico de batalha, etc.

  b. Uma página de usuário, onde você pode ver o exército zumbi de um usuário com um link permanente. Você poderia clicar em um zumbi individual para ver sua página, e também clicar em um zumbi para atacá-lo se você estiver logado na MetaMask e tiver um exército.
  
  c. Uma página inicial, que é uma variação da página do usuário que mostra o exército zumbi do usuário atual. (Esta é a página que começamos a implementar em index.html).

4. Algum método na interface do usuário que permite ao usuário alimentar em CryptoKitties. Poderíamos ter um botão de cada zumbi na página inicial que diz "Feed Me", em seguida, uma caixa de texto que levou o usuário a digitar um ID do kitty (ou um URL para esse gatinho, por exemplo, <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Isso acionaria nossa função `feedOnKitty`.

5. Algum método na interface do usuário para o usuário atacar o zumbi de outro usuário.

  Uma maneira de implementar isso seria quando o usuário estivesse navegando na página de outro usuário, poderia haver um botão que dizia "Ataque este zumbi". Quando o usuário clica nele, ele abre um modal que contém o exército de zumbis do usuário atual e pergunta "Com qual zumbi você gostaria de atacar?"

  A página inicial do usuário também pode ter um botão de cada um dos seus zumbis que diz "Ataque um zumbi". Quando eles clicaram, poderia aparecer um modal com um campo de busca onde eles poderiam digitar o ID de um zumbi para procurá-lo. Ou uma opção que dizia "Ataque um zumbi qualquer", que procuraria um número aleatório por eles.

  Também gostaríamos de desabilitar os zumbis do usuário, cujo período de espera ainda não passou, então a interface do usuário pode indicar ao usuário que eles ainda não podem atacar com aquele zumbi, e por quanto tempo eles terão que esperar.

6. A página inicial do usuário também teria opções de cada zumbi para mudar o nome, alterar o DNA e subir de nível (por uma taxa). As opções seriam exibidas em cinza se o usuário ainda não estivesse no nível alto o suficiente.

7. Para novos usuários, devemos exibir uma mensagem de boas-vindas com um aviso para criar o primeiro zumbi em seu exército, que chama `createPseudoRandomZombie()`.

8. Nós provavelmente quereríamos adicionar um evento `Attack` ao nosso smart contract com o `address` do usuário como uma propriedade `indexed`, conforme discutido no último capítulo. Isso nos permitiria criar notificações em tempo real — poderíamos mostrar ao usuário um alerta popup quando um de seus zumbis fosse atacado, para que eles pudessem ver o usuário / zumbi que os atacou e retaliar.

9. Provavelmente, também queremos implementar algum tipo de camada de cache de front-end, de modo que nem sempre estamos batendo na Infura com pedidos para os mesmos dados. (Nossa implementação atual de `displayZombies` chama `getZombieDetails` para cada único zumbi toda vez que atualizamos a interface — mas realisticamente só precisamos chamar isso para o novo zumbi que foi adicionado ao nosso exército).

10. Uma sala de bate-papo em tempo real para que você pudesse falar mal dos outros jogadores enquanto esmaga seu exército de zumbis? Sim por favor.

Isso é apenas um começo — tenho certeza de que poderíamos criar ainda mais recursos — e já é uma lista enorme.

Como há um monte de códigos front-end que criariam uma interface completa como essa (HTML, CSS, JavaScript e uma estrutura como React ou Vue.js), construir esse front-end inteiro provavelmente seria um curso completo com 10 lições em si. Então vamos deixar a implementação incrível para você.

> Nota: Mesmo que o nosso smart contract seja descentralizado, este front-end para interagir com o nosso DApp seria totalmente centralizado no nosso servidor web em algum lugar.
>
> No entanto, com o SDK, estamos construindo em <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a- dappchain-near-you-29d26da00880 " target=_blank>Loom Network</a>, em breve você poderá servir front-ends como este de seu próprio DAppChain em vez de um servidor web centralizado. Assim entre o Ethereum e o DAppChain do Loom, todo o seu aplicativo rodaria 100% no blockchain.

## Conclusão

Isso conclui a Lição 6. Agora você tem todas as habilidades necessárias para codificar um smart contract e um front-end que permite aos usuários interagir com ele!

Na próxima lição, vamos cobrir a última peça que faltava neste quebra-cabeça — implantar seus contratos inteligentes na Ethereum.

Vá em frente e clique em "Próximo capítulo" para reivindicar suas recompensas!
