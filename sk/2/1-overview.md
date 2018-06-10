---
title: Prehľad Lekcie 2
actions: ['checkAnswer', 'hints']
material:
  saveZombie: false
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---

V Lekcii 1 sme vytvorili funkciu ktorá príjma meno a vygeneruje pomocou neho náhodného zombie. Toho potom pridáva zombie databázy tvojej aplikácie na blockchaine.
In lesson 1, we created a function that takes a name, uses it to generate a random zombie, and adds that zombie to our app's zombie database on the blockchain.

V Lekcií 2 vylepšíme našu aplikáciu, aby sa trochu viac podobala hre. Bude to multi-player, pridáme tiež zaujímavejší spôsob ako vytvárať nových zombie namiesto obyčajnej náhodnej generácie.
In lesson 2, we're going to make our app more game-like: We're going to make it multi-player, and we'll also be adding a more fun way to create zombies instead of just generating them randomly.

Ako teda budeme vytvárať nových Zombie? Tak, že sa necháme našich Zombie "nakŕmiť" na iných formách života.
How will we create new zombies? By having our zombies "feed" on other lifeforms!

## Zombie Kŕmenie
## Zombie Feeding

Keď sa zombie kŕmi, infikuje svoju obeť vírusom. Vírus potom transformuje obeť na nového zombie ktorý sa pridá do tvojej zombie armády. DNA nového zombie bude vypočítaná z DNA obete a z DNA zombie ktorý ju napadol.
When a zombie feeds, it infects the host with a virus. The virus then turns the host into a new zombie that joins your army. The new zombie's DNA will be calculated from the previous zombie's DNA and the host's DNA.

A na čom sa naši zombie kŕmia najradšej?
And what do our zombies like to feed on most?

Aby sme sa to dozvedeli... Musíš dokončit lekciu 2!
To find that out... You'll have to complete lesson 2!

# Vyskúšaj si to sám
# Put it to the test

V pravej časti stránky je jednoduchá ukážka kŕmenia. Klikni na človeka a sleduje čo sa stane keď sa na ňom začne kŕmiť zombie.
There's a simple demo of feeding to the right. Click on a human to see what happens when your zombie feeds!

Všimni si že DNA nového zombie je určené originálnym Zombie DNA, ale taktiež DNA napadnudej obete.
You can see that the new zombie's DNA is determined by your original zombie's DNA, as well as the host's DNA.

Keď budes pripravený, klikni na "Dalšia kapitola". Začneme pracovať na tom aby naša hra bola multi-player.
When you're ready, click "Next chapter" to move on, and let's get started by making our game multi-player.
