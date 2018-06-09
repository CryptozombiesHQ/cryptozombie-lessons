---
title: Prehľad lekcie
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

V Lekcii + si postavíš svoju vlastnú "Zombie Továreň" na vytváranie armády zombie.
In Lesson 1, you're going to build a "Zombie Factory" to build an army of zombies.

* Naša továreň si bude udržovať databázu všetkých zombie našej armády
* Naša továreň bude mať funkciu pre vytváranie nových zombies
* Každý zombie bude mať náhodný a unikátny vzhľad
* Our factory will maintain a database of all zombies in our army
* Our factory will have a function for creating new zombies
* Each zombie will have a random and unique appearance

V ďalších lekciách pridáme ďalšiu funkcionalitu, ako napríklad schopnosť zombie napádať ľudí a iných zombies. Ale pred tým než sa k tomu dostaneme, musíme vytvoriť základnú funkcionalitu na vytváranie nových zombie.  
In later lessons, we'll add more functionality, like giving zombies the ability to attack humans or other zombies! But before we get there, we have to add the basic functionality of creating new zombies.

## Ako bude fungovať Zombie DNA
## How Zombie DNA Works

Vzhľad zombie bude daný hodnotou Zombie DNA. Zombie DNA je jednoduché - je to proste 16-ciferné čislo, ako napríklad:
The zombie's appearance will be based on its "Zombie DNA". Zombie DNA is simple — it's a 16-digit integer, like:

```
8356281049284737
```

Rovnako ako v skutočnom DNA, jednotlivé časti tohoto čísla sa budú mapovať na rozličné vlasnosti. Prvé dve čísla sa mapujú na typ zombie hlavy, dalšie dve čísla typ zombie očí, a tak ďalej. 
Just like real DNA, different parts of this number will map to different traits. The first 2 digits map to the zombie's head type, the second 2 digits to the zombie's eyes, etc.

> Poznámka: Aby sme v rámci tohoto tutoriálu veci zbytočne nekomplikovali, naši zombies budú mať 7 rozličných typov hláv (napriek tomu že 2 cifry by nám umožnili až 100 možných typov). Počet hláv môžeme rozšíriť neskôr dodatočne, ak by sme sa rozhodli rozšíriť počet variácií.
> Note: For this tutorial, we've kept things simple, and our zombies can have only 7 different types of heads (even though 2 digits allow 100 possible options). Later on we could add more head types if we wanted to increase the number of zombie variations.

Typ hlavy z prvých dvoch čísel vypočítame nasledovne. Ak napríklad prvé 2 cifry DNA sú `83`, vypočítame typ hlavy ako `83 % 7 + 1` = 7. Takže v tomto prípade by Zombie mal typ hlavy číslo 7.
For example, the first 2 digits of our example DNA above are `83`. To map that to the zombie's head type, we do `83 % 7 + 1` = 7. So this Zombie would have the 7th zombie head type. 

V paneli vpravo si môžeš vyskúšať posunúť `head gene` slider na 7mi typ hlavy (so Santa klobúkom) aby si videl čo by spravil hlavový gén 83 s naším zombie.
In the panel to the right, go ahead and move the `head gene` slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to.

# Vyskúšaj si to sám
# Put it to the test

1. Skús sa pohrať so slidermi na pravej časti stránky. Experimentuj ako rozdielne numerické hodnoty ovplyvňujú rozličné aspekty vzhľadu zombie.
1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance.

Ok, dosť bolo srandy. Keď budeš pripravený pokračovať, stlač "Ďalšia Kapitola" a ponoríme sa opäť o level hlbšie do Solidity. 
Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity!
