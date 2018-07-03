---
title: O lekcji pierwszej
actions: ['zaznacz odpowiedź', 'podpowiedź']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

W lekcji 1 zbudujesz "Zombie Factory" aby zbudować w niej armię zombich.

* Nasza fabryka będzie zarządzała bazą danych z wszystkimi zombie w twojej armii
* Nasza fabryka będzie miała funkcje do tworzenia nowych zombie
* Każdy zombi będzie miał losowy unikatowy numer powiązany z wyglądem

W następnych lekcjach, dodamy więcej funkcjonalności. Zombie będzie mógł atakować ludzi lub innych zombi! Wcześniej jednak musimy dodać podstawową funkcjonalność, jaką jest tworzenie nowego zombi.

## Jak działa Zombie DNA

Wygląd zombi bazuje na "Zombie DNA". Zombie DNA zwykłym numerem — czyli 16-znakowym integer, jak np:

```
8356281049284737
```

Tak jak w prawdziwym DNA, różne części tego numeru, będą onaczały różne cechy. Pierwsze dwa znaki oznaczają rodzaj głowy zombie, następne dwa znaki oczy zombi itd.

> Notatka: Na potrzeby tego tutorialu, upraszczamy wiele rzeczy. Nasz zombi może mieć tylko 7 różnych typów głowy (pomimo, że dwie cyfry pozwalają na 100). Później będziemy mogli dodać więcej typów głowy, jeśli będziemy chcieli podnieść liczbę możliwości.

Na przykład, dwie pierwsze cyfry naszego przykładowago DNA powyżej to `83`. Aby przeliczyć je do jednego z rodzajów głowy który mamy, trzeba wykonać obliczenie `83 % 7 + 1` = 7. Więc zombie będzie miał głowę typu 7. 

W panelu po prawej stronie, zmień `geny głowy` przejdź do siódmej głowy (czapka Świętego Mikołaja) aby zobaczyć cechę `83` która jest z nią związana.

# Zadanie do wykonania

1. Popróbuj różnych konfiguracji slajderów po prawej stronia. Eksperymentuj, aby zobaczyć jak zmiana poszczególnych numerów, wpływa na wygląd zombi.

Kiedy bedziesz gotowy aby kontynuować,  naciśnij "Następny Rozdział" poniżej, i zagłęb się w naukę Solidity!
