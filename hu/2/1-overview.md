---
title: 2. lecke áttekintés
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  saveZombie: false
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---

Az 1. leckében létrehoztunk egy függvényt, amely egy nevet vesz, használja egy véletlenszerű zombi generálásához, és hozzáadja azt a zombit az alkalmazásunk zombi adatbázisához a blockchainen.

A 2. leckében játékosabbá tesszük az alkalmazásunkat: többjátékos lesz, és egy szórakoztatóbb módot is hozzáadunk a zombik létrehozásához, ahelyett, hogy csak véletlenszerűen generálnánk őket.

Hogyan hozunk létre új zombikat? Úgy, hogy a zombijaink "táplálkoznak" más élőlényeken!

## Zombi táplálkozás

Amikor egy zombi táplálkozik, vírussal fertőzi meg a gazdát. A vírus aztán új zombit csinál a gazdából, amely csatlakozik a seregedhez. Az új zombi DNS-e az előző zombi DNS-éből és a gazda DNS-éből lesz kiszámítva.

És mivel szeretnek leginkább táplálkozni a zombijaink?

Hogy megtudjad... be kell fejezned a 2. leckét!

# Tegyük próbára

Van egy egyszerű táplálkozási demo a jobb oldalon. Kattints egy emberre, hogy lásd, mi történik, amikor a zombid táplálkozik!

Láthatod, hogy az új zombi DNS-e az eredeti zombid DNS-éből, valamint a gazda DNS-éből kerül meghatározásra.

Amikor készen állsz, kattints a "Következő fejezet" gombra a folytatáshoz, és kezdjük el, hogy többjátékos legyen a játékunk.
