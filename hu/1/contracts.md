---
title: "Szerződések"
actions: ['checkAnswer', 'hints']
requireLogin: true
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Add meg a solidity verziót itt

      //2. Hozd létre a szerződést itt
    answer: > 
      pragma solidity >=0.5.0 <0.6.0;


      contract ZombieFactory {

      }
---

Kezdjük az abszolút alapokkal:

A Solidity kódja **szerződésekben** van beágyazva. Egy `contract` az Ethereum alkalmazások alapvető építőköve — minden változó és függvény egy szerződéshez tartozik, és ez lesz az összes projekted kiindulópontja.

Egy üres szerződés `HelloWorld` néven így nézne ki:

```
contract HelloWorld {

}
```

## Verzió Pragma

Minden solidity forráskódnak egy "version pragma"-val kell kezdődnie — ez a Solidity fordító verziójának deklarációja, amelyet ez a kód használni fog. Ez megelőzi, hogy a jövőbeli fordító verziók esetleg olyan változásokat vezessenek be, amelyek törnék a kódodat.

Ebben az oktatóanyagban azt szeretnénk, hogy az okos szerződéseinket bármely fordító verzióval le lehessen fordítani a 0.5.0 (beleértve) és 0.6.0 (kizárva) közötti tartományban.
Így néz ki: `pragma solidity >=0.5.0 <0.6.0;`.

Összefoglalva, itt van egy alapvető kiinduló szerződés — az első dolog, amit minden alkalommal írsz, amikor új projektet kezdesz:

```
pragma solidity >=0.5.0 <0.6.0;

contract HelloWorld {

}
```

# Tegyük próbára

A Zombie seregünk létrehozásának megkezdéséhez hozzunk létre egy alap szerződést `ZombieFactory` néven.

1. A jobb oldali mezőben állítsd be, hogy a szerződésünk a `>=0.5.0 <0.6.0` solidity verziót használja.

2. Hozz létre egy üres szerződést `ZombieFactory` néven.

Amikor kész vagy, kattints a "Válasz ellenőrzése" gombra lent. Ha elakadtál, kattinthatasz a "Tipp" gombra.
