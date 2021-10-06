---
title: Web3.js
actions: ['vérifierLaRéponse', 'indice']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

Notre contrat Solidity est fini ! Maintenant nous devons écrire la partie client en JavaScript pour interagir avec le contrat.

Ethereum a une bibliothèque JavaScript appelée **_Web3.js_**.

Dans une prochaine leçon, nous verrons en détail comment déployer un contrat et configurer Web3.js. Mais pour l'instant, regardons simplement un exemple de code pour voir comment Web3.js pourrait interagir avec notre contrat déployé.

Ne vous inquiétez pas si ce n'est pas très clair pour l'instant.

```
// Voici comment nous accéderions à notre contrat
var abi = /* abi générée par le compilateur */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* l'adresse de notre contrat Ethereum après avoir été déployé */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` a accès aux fonctions et évènements publiques de notre contrat

// une sorte d'écouteur d'événement pour enregistrer l'entrée de texte :
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Appelle la fonction `createPseudoRandomZombie` de notre contrat :
  ZombieFactory.createPseudoRandomZombie(name)
})

// Écoute l'évènement `NewZombie`, et met à jour l'interface utilisateur
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// Prend l'ADN Zombie, et met à jour l'image
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // Rempli le devant de l'ADN avec des zéros s'il y a moins de 16 caractères
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // Les 2 premiers chiffres définissent la tête. Il y a 7 possibilités,
    // donc % 7 pour avoir un nombre entre 0 et 6, on ajoute ensuite 1
    // pour avoir entre 1 et 7. Nous avons ensuite 7 fichiers images
    // nommés "head1.png" jusqu`à "head7.png" que nous chargeons en fonction
    // de ce nombre.
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2ème 2 chiffres définissent les yeux, 11 variations:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variations de haut :
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // Les 6 derniers chiffres contrôlent la couleur. Mise à jour à l'aide
    // du filtre CSS : hue-rotate qui a 360 degrés :
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Notre code JavaScript prends alors les valeurs générées dans `zombieDetails` ci-dessus, et utilise de la magie JavaScript (nous utilisons Vue.js) pour changer les images et appliquer des filtres CSS. Vous obtiendrez tout le code nécessaire dans une prochaine leçon.

# A votre tour d’essayer !

Allez-y - rentrer un nom dans le champ à droite, et regardez quel zombie vous obtiendrez !

**Une fois que vous avez un zombie qui vous satisfait, cliquez sur "Prochain Chapitre" ci-dessous pour enregistrer votre zombie et terminer la leçon 1 !**
