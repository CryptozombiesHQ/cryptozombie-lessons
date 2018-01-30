---
title: Aperçu de la leçon
actions: ['vérifierLaRéponse', 'indice']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Dans la leçon 1, vous allez faire une "usine de zombies" afin d'avoir une armée de zombies.

* Notre usine maintiendra une base de données des zombies de notre armée
* Notre usine aura une fonction pour créer de nouveaux zombies
* Chaque zombie aura une apparence aléatoire et unique

Dans les leçons suivantes, nous ajouterons plus de fonctionnalités, comme donner aux zombies la capacité d'attaquer des humains ou d'autres zombies ! Mais avant d'en arriver là, nous devons commencer par la fonctionnalité de base pour créer de nouveaux zombies.

## Comment marche l'ADN Zombie

L'apparence du zombie va dépendre de son "ADN Zombie". L'ADN d'un Zombie est simple - c'est un entier de 16 chiffres, comme :

```
8356281049284737
```

Tout comme l'ADN réel, différentes parties de ce nombre représenteront différents traits. Les 2 premiers chiffres correspondent au type de tête du zombie, les 2 derniers chiffres aux yeux du zombie, etc.

> Remarque : Pour ce tutoriel, nous avons fait simple, et nos zombies peuvent avoir seulement 7 types de têtes différentes (même si 2 chiffres permettent 100 options possibles). Plus tard, nous pourrions ajouter plus de types de têtes si nous voulions augmenter le nombre de variations de zombies.

Par exemple, les 2 premiers chiffres de note ADN exemple sont `83`. Pour faire correspondre à un type de tête, nous devons faire `83 % 7 + 1` = 7. Ce Zombie aura donc le 7ième type de tête.

Dans le panneau de droite, essayez de déplacer le curseur `head gene` (gène pour la tête) sur la 7ème tête (le bonnet de Noël) pour voir à quel trait correspond le `83`.


# A votre tour

1. Jouez avec les curseurs sur le côté droit de la page. Testez pour voir comment les différentes valeurs numériques influent sur les différents aspects de l'apparence du zombie.

Allez, assez jouer. Lorsque vous êtes prêt à continuer, cliquez sur "Next Chapter" ci-dessous, et plongeons dans l'apprentissage de Solidity !
