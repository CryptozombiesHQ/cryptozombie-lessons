---
title: Conclusion
actions: ['vérifierLaRéponse', 'indice']
requireLogin: true
material:
  saveZombie: false
  zombieDeck:
    zombie:
      lesson: 6
    hideSliders: true
    answer: 1
---

Félicitations ! Vous avez écrit avec succès votre premier front-end Web3.js qui interagit avec votre smart contract.

Comme récompense, vous obtenez votre propre zombie `The Phantom of Web3` de niveau 3.0 (pour Web 3.0 😉), avec en plus le masque de renard. Vous pouvez le voir à droite.

## Prochaines Étapes

Cette leçon était volontairement basique. Nous voulions vous montrer la logique de base dont vous auriez besoin pour interagir avec votre smart contract, mais nous ne voulions pas prendre trop de temps en faisant une implémentation complète car la portion Web3.js est plutôt répétitive, et nous n'aurions pas introduit de nouveaux concepts en faisant cette leçon plus longue.

L'implémentation est donc minimale. Voici une liste d'idées de choses que l'on voudrait rajouter pour faire de notre front-end une implémentation complète pour notre jeu de zombie, si vous voulez construire votre propre jeu par vous-mêmes :

1. Implémenter des fonctions pour `attack`, `changeName`, `changeDna`, et les fonctions ERC721 `transfer`, `ownerOf`, `balanceOf`, etc. L'implémentation de ces fonctions sera identique aux autres transactions `send` que nous avons vu.

2. Implémenter une "page admin" où vous pouvez exécuter `setKittyContractAddress`, `setLevelUpFee`, et `withdraw`. Ici encore, il n'y a pas de logique spéciale coté front-end - ces implémentations seraient identiques aux fonctions que nous avons déjà vu. Vous devrez juste vous assurer que vous les appelez depuis la même adresse Ethereum que celle qui a déployé le contrat, puisqu'elles ont le modificateur `onlyOwner`.

3. Il y a plusieurs vues dans notre application que nous voudrions implémenter :

  a. Une page zombie individuelle, où l'on peut voir les infos d'un zombie en particulier avec un lien permanent associé. Cette page devra afficher l'apparence du zombie, son nom, son propriétaire (avec un lien vers le profil de l'utilisateur), son compteur victoires/défaites, son historique de combats, etc.

  b. Une page utilisateur, où l'on peut voir l'armée de zombie d'un utilisateur avec un lien permanent. On doit pouvoir cliquer sur un zombie pour voir sa page, et aussi cliquer sur un zombie pour l'attaquer si on est connecté avec MetaMask et qu'on a une armée.

  c. Une page d'accueil, qui est une variation de la page utilisateur qui montre l'armée de zombie de l'utilisateur actuel. (C'est la page que nous avons commencé avec index.html).

4. Des fonctions dans l'interface, qui permettent à l'utilisateur de se nourrir de CryptoKitties. Il pourrait y avoir un bouton sur chaque zombie de la page d'accueil qui dit "Nourris moi", puis un champ de texte qui demande à l'utilisateur l'ID du chaton (ou l'URL de ce chaton, ex : <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Cela déclencherait la fonction `feedOnKitty`.

5. Une fonction dans l'interface pour que l'utilisateur puisse attaquer le zombie d'un autre utilisateur.

  Une façon de faire ça serait que lorsque l'utilisateur navigue sur la page d'un autre utilisateur, il pourrait y avoir un bouton qui dit "Attaquer ce zombie". Quand l'utilisateur clique dessus, cela afficherait une modale qui contiendrait l'armée de l'utilisateur actif et lui demanderait "Avec quel zombie voulez-vous attaquer ?"

  La page d'accueil utilisateur pourrait aussi avoir un bouton pour chaque zombie "Attaquer un autre zombie". Une fois cliqué, cela pourrait afficher une modale avec un champ de recherche pour entrer l'ID d'un zombie. Une option pourrait dire "Attaquer un zombie aléatoire", qui rechercherait un nombre aléatoire.

  Il faudrait aussi griser les zombies de l'utilisateur dont la période d'attente n'est pas encore passée, afin que l'interface indique à l'utilisateur qu'il ne peut pas attaquer avec ce zombie, et combien de temps il doit attendre.

6. La page d'accueil utilisateur pourrait aussi avoir comme options pour chaque zombie de changer son nom, changer son ADN et gagner un niveau (avec un frais). Les options seraient grisées si l'utilisateur n'a pas encore le bon niveau.

7. Pour les nouveaux utilisateurs, on pourrait afficher un message de bienvenue avec un moyen pour créer son premier zombie, en appelant `createPseudoRandomZombie()`.

8. On voudrait sûrement ajouter un évènement `Attack` à notre smart contract avec l'adresse de l'utilisateur comme propriété `indexed` comme vu dans le chapitre précédent. Cela permettrait d'avoir des notifications en temps réel - on pourrait afficher une alerte à un utilisateur lorsque l'un de ses zombies est attaqué, et il pourrait voir le zombie/utilisateur qui l'a attaqué et rendre la pareille.

9. On voudrait certainement implémenter une sorte de cache pour notre front-end afin que nous ne soyons pas constamment en train d'interroger Infura avec des requêtes pour les mêmes données. (Notre implémentation actuelle de `displayZombies` appelle `getZombieDetails` pour chaque zombie à chaque fois que nous rafraîchissons l'interface - mais normalement nous devrions l'appeler seulement pour les nouveaux zombies ajoutés à notre armée).

10. Un chat en temps réel pour narguer les autres utilisateurs quand on écrase leur armée de zombie ? Oui svp.

C'est juste un début - Je suis sûr que vous avez encore pleins d'idées pour l'améliorer - et c'est déjà une bonne liste.

Puisqu'il y a beaucoup de code front-end dont nous aurions besoin pour créer une interface comme celle-là (HTML, CSS, JavaScript et un framework comme React ou Vue.js), construire tout cela serait sûrement un cours à part avec une dizaine leçons. Nous vous laissons donc le soin de l'implémenter vous-mêmes.

> Remarque : Même si notre smart contract est décentralisé, cette interface pour interagir avec notre DApp est complètement centralisée sur un serveur quelque part.
>
> Cependant, avec le SDK que nous sommes en train de développer à href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, bientôt vous pourrez avoir des front-end comme celui-ci sur leur propre DAppChain au lieu d'un serveur centralisé. De cette manière, entre Ethereum et la DAppChain de Loom, l'ensemble de votre application sera à 100% sur la blockchain.

## Conclusion

Cela termine la Leçon 6. Vous avez maintenant les compétences nécessaires pour coder un smart contrat et une application front-end pour que vos utilisateurs interagissent avec !

Dans la prochaine leçon, nous allons voir la pièce manquante du puzzle - déployer votre smart contract sur Ethereum.

Cliquez sur "Prochain Chapitre" pour obtenir vos récompenses !
