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

> Uwaga: W tym tutorialu, uprościmy sobie pewne rzeczy i nasze Zombiaki będą miały tylko 7 różnych typów głów (mimo, że 2 cyfry są w stanie zrobić 100 możliwych kombinacji). Później możemy dodać więcej typów głów jeśli chcemy zwiększyć ilość możliwych zmian wyglądu zombi.

Na przykład, pierwsze dwie cyfry naszego DNA powyżej to `83`. Aby przełożyć to na rodzaj głowy zombi wykonujemy prostą kalkulację `83 % 7 + 1` = 7. Więc ten Zombi będzie miał siódmy (z kolei) typ głowy.

W panelu obok, przesuń suwak `gen głowy` do numeru 7 (czapka mikołaja) i zobacz jakiej cesze odpowiada kod `83`.

# Wypróbujmy zatem

1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance.

Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity!