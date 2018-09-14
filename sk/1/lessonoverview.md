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

V Lekcii 1 si postavíš svoju vlastnú "Zombie Továreň" na vytvorenie zombie armády.

* Naša továreň si bude udržovať databázu všetkých zombie našej armády
* Bude mať funkciu pre vytváranie nových zombies
* Každý zombie bude mať náhodný a unikátny vzhľad

V ďalších lekciách pridáme viac funkcionality, ako napríklad schopnosť zombie napádať ľudí a iných zombie. Pred tým než sa k tomu ale dostaneme, musíme vytvoriť základnú funkcionalitu na vytváranie nových zombie.  

## Ako funguje Zombie DNA

Vzhľad zombie bude určený hodnotou Zombie DNA. Zombie DNA je jednoduché. Bude to proste 16-ciferné čislo, ako napríklad:

```
8356281049284737
```

Rovnako ako v skutočnom DNA, jednotlivé časti tohoto čísla sa budú reprezentovať rozličné vlasnosti. Prvé dve čísla sa mapujú na typ zombie hlavy, dalšie dve čísla typ zombie očí, a tak ďalej. 

> Poznámka: Aby sme v rámci tohoto tutoriálu veci zbytočne nekomplikovali, naši zombies budú mať 7 rozličných typov hláv (napriek tomu, že 2 cifry by nám umožnili až 100 možných typov). Počet hláv môžeme rozšíriť neskôr dodatočne, ak by sme sa rozhodli rozšíriť počet variácií.

Typ hlavy z prvých dvoch čísel vypočítame nasledovne. Ak napríklad prvé 2 cifry DNA sú `83`, vypočítame typ hlavy ako `83 % 7 + 1` = 7. Takže v tomto prípade by Zombie mal typ hlavy číslo 7.

V paneli vpravo si môžeš vyskúšať posunúť `head gene` slider na siedmy typ hlavy (so Santa klobúkom), aby si videl čo by so zombie spravil hlavový gén 83.

# Vyskúšaj si to sám

1. Skús sa pohrať so slidermi na pravej časti stránky. Experimentuj a sleduj, ako rozdielne numerické hodnoty ovplyvňujú rozličné aspekty vzhľadu zombie.

Ok, dosť bolo srandy. Keď budeš pripravený pokračovať, stlač "Ďalšia Kapitola" a ponoríme sa opäť o level hlbšie do Solidity. 
