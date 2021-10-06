---
title: Conclusion
actions: ['vérifierLaRéponse', 'indice']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

Et voila, vous avez terminé la leçon 2 !

Vous pouvez voir comment cela fonctionne avec la démo à droite. Allez-y, je sais que nous avez hâte d'arriver en bas de cette page 😉. Cliquez sur un chaton pour l'attaquer et regardez le nouveau zombie que vous obtiendrez !

## Implémentation JavaScript

Une fois que nous sommes prêt à déployer ce contrat sur Ethereum, nous avons juste besoin de compiler et déployer `ZombieFeeding` - vu que c'est notre contrat final qui hérite de `ZombieFactory`, et qui a accès à tous les fonctions publiques des deux contrats.

Voici un exemple d'interaction avec notre contrat déployé utilisant JavaScript et web3.js:

```
var abi = /* abi générée par le compilateur */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* l'adresse de notre contrat sur Ethereum une fois déployé */
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// En supposant que nous ayons l'ADN de notre zombie et l'ID du chaton que l'on veut attaquer
let zombieId = 1;
let kittyId = 1;

// Pour obtenir l'image CryptoKitty, nous avons besoin d'interroger leur API web.
// Cette information n'est pas stockée sur la blockchain, seulement sur leur
// serveur web. Si tout était stocké sur la blockchain, nous n'aurions pas
// besoin de s'inquiéter que les serveurs tombent en panne, qu'ils changent leur
// API ou que la compagnie décide de nous bloquer l'accès à leurs images s'ils
// n'aiment pas notre jeu de zombie ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // faire quelque chose pour afficher l'image
})

// Quand l'utilisateur clique sur un chaton :
$(".kittyImage").click(function(e) {
  // Appeler la fonction `feedOnKitty` de notre contrat
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Écoute un évènement NewZombie de notre contrat pour l'afficher :
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Cette fonction va afficher le zombie, comme dans la leçon 1 :
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# A votre tout d'essayer !

Choisissez un chaton que vous voulez donner à manger. L'ADN de votre zombie et celui du chaton vont se mélanger, et vous aurez un nouveau zombie dans votre armée !

Vous avez vu ces jolies jambes de chat sur votre nouveau zombie ? C'est grâce aux chiffres `99` à la fin de notre ADN 😉

Vous pouvez recommencer si vous le souhaitez. Quand vous avez un zombie qui vous plaît (vous n'en aurez qu'un), continuez et passez au prochain chapitre pour terminer la leçon 2 !
