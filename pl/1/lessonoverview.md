---
title: Przegląd Lekcji
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
skipCheckAnswer: prawda
material:
  saveZombie: fałsz
  zombieResult:
    hideNameField: prawda
    ignoreZombieCache: prawda
    answer: 1
---
W lekcji 1 zbudujesz "Fabrykę Zombie", aby stworzyć armię zombi.

* Nasza fabryka będzie obsługiwała bazę danych ze wszystkimi zombiakami w naszej armii
* Będzie posiadała funkcję do tworzenia nowych zombi
* Każdy zombi będzie miał losowy i niepowtarzalny wygląd

W późniejszych lekcjach, dodamy więcej funkcjonalności, takich jak danie zombiakom możliwości atakowania ludzi lub innych zombi! Ale zanim do tego dojdziemy, musimy zaimplementować podstawową funkcjonalność tworzenia nowych zombi.

## Jak działa DNA Zombiaka

Wygląd Zombi jest oparty na jego "Zombie DNA". Zombie DNA jest proste — jest to 16-to cyfrowa liczba (integer), taka jak poniżej:

    8356281049284737
    

Tak jak prawdziwe DNA, różne jego części odpowiadają za różne cechy. Pierwsze dwie cyfry odnoszą się do typu głowy, kolejne dwie do oczu, itd.

> Note: For this tutorial, we've kept things simple, and our zombies can have only 7 different types of heads (even though 2 digits allow 100 possible options). Later on we could add more head types if we wanted to increase the number of zombie variations.

For example, the first 2 digits of our example DNA above are `83`. To map that to the zombie's head type, we do `83 % 7 + 1` = 7. So this Zombie would have the 7th zombie head type.

In the panel to the right, go ahead and move the `head gene` slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to.

# Put it to the test

1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance.

Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity!