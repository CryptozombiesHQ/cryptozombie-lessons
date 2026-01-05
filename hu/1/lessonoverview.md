---
title: Lecke Áttekintés
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
requireLogin: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Az 1. leckében egy "Zombie Gyárat" fogsz építeni, hogy zombi sereget hozz létre.

* A gyárunk egy adatbázist fog tartani az összes zombiról a seregünkben
* A gyárunknak lesz egy függvénye új zombik létrehozásához
* Minden zombinak véletlenszerű és egyedi megjelenése lesz

A későbbi leckékben további funkcionalitást adunk hozzá, például a képességet, hogy a zombik embereket vagy más zombikat támadjanak! De mielőtt odaérünk, hozzá kell adnunk az új zombik létrehozásának alapvető funkcionalitását.

## Hogyan működik a Zombie DNS

A zombi megjelenése a "Zombie DNS"-én fog alapulni. A Zombie DNS egyszerű — ez egy 16 számjegyű egész szám, például:

```
8356281049284737
```

Akárcsak a valódi DNS, ennek a számnak különböző részei különböző tulajdonságokra mutatnak. Az első 2 számjegy a zombi fej típusára mutat, a második 2 számjegy a zombi szemeire, stb.

> Megjegyzés: Ebben az oktatóanyagban az egyszerűség kedvéért a zombijaink csak 7 különböző fejtípussal rendelkezhetnek (annak ellenére, hogy 2 számjegy 100 lehetséges opciót tesz lehetővé). Később hozzáadhatunk több fejtípust, ha növelni akarjuk a zombi variációk számát.

Például, a fenti példa DNS első 2 számjegye `83`. Ennek a zombi fej típusára való leképezéséhez a következőt csináljuk: `83 % 7 + 1` = 7. Tehát ennek a Zombienak a 7. zombi fej típusa lenne.

A jobb oldali panelben menj előre és mozgasd a `head gene` csúszkát a 7. fejre (a Mikulás kalap), hogy lásd, milyen tulajdonságnak felelne meg a `83`.

# Tegyük próbára

1. Játsz a jobb oldali csúszkákkal. Kísérletezz, hogy lásd, hogyan felelnek meg a különböző numerikus értékek a zombi megjelenésének különböző aspektusainak.

Oké, elég a játszadozásból. Amikor készen állsz a folytatásra, kattints a "Következő fejezet" gombra lent, és merüljünk el a Solidity tanulásában!
