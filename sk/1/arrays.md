---
title: Polia
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          // start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

      }
---

Keď chceme vytvoriť kolekciu niečoho, možeme použit **polia**. V solidity existujú dva druhy polí: **_fixné_** polia a **dynamické_** polia:

```
// Toto pole ma fixnú dĺžku 2 prvkov:
uint[2] fixedArray;
// iné fixné pole, toto môže udržovať 5 reťazcov:
string[5] stringArray;
// dynamické pole - nemá presnú fixnú dĺžku, môže veľkosťou narastať
uint[] dynamicArray;
```

Môžeš taktiež vyvoriť pole **_štruktúr_** (**_structs_**). Napríklad použitím štruktúry `Person` z predošlej lekcie:

```
Person[] people; // dynamické pole, môže do neho pridávať nové prvky
```

Spomínaš si na to, že stavové premenné su permanentne uložené na blockchaine? To znamená že vytváranie takéhoto dynamického poľa nám môže slúžiť na ukladanie štrukturovaných dát v našom kontrakte. Je to ako taká databáza.

## Verejné (public) polia

Pole môžeš deklarovať ako `public`. V takom prípade pre ne Solidity automaticky vytvorí **_getter_** metódu. Syntax je nasledovná:

```
Person[] public people;
```

Iné kontrakty by potom mohli dáta z toho poľa čítať (no nie do neho zapisovať). Je to užitočný programovací vzor pre ukladanie dát do našeho kontraktu.

# Vyskúšaj si to sám

Chceme aby naša aplikácia udržiavala informáciu o armáde všetkých zombie. Ďalej chcem aby ostatné aplikácie taktiež mali k našim zombie prístup, takže chceme aby zombie boli verejný.

1. Vytvor verejné `public` pole `Zombie` štruktúr (**_structs_**) s názvom `zombies`.
