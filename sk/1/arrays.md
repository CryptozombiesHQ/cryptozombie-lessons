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
When you want a collection of something, you can use an **_array_**. There are two types of arrays in Solidity: **_fixed_** arrays and **_dynamic_** arrays:

```
// Toto pole ma fixnú dĺžku 2 prvkov:
// Array with a fixed length of 2 elements:
uint[2] fixedArray;
// another fixed Array, can contain 5 strings:
// iné fixné pole, toto môže udržovať 5 reťazcov:
string[5] stringArray;
// dynamické pole - nemá presnú fixnú dĺžku, môže veľkosťou narastať
// a dynamic Array - has no fixed size, can keep growing:
uint[] dynamicArray;
```

Môžeš taktiež vyvoriť pole **_štruktúr_** (**_structs_**). Napríklad použitím štruktúry `Person` z predošlej lekcie:
You can also create an array of **_structs_**. Using the previous chapter's `Person` struct:

```
Person[] people; // dynamické pole, môže do neho pridávať nové prvky
```

Spomínaš si na to, že stavové premenné su permanentne uložené na blockchaine? To znamená že vytváranie takéhoto dynamického poľa nám môže slúžiť na ukladanie štrukturovaných dát v našom kontrakte. Je to ako taká databáza.
Remember that state variables are stored permanently in the blockchain? So creating a dynamic array of structs like this can be useful for storing structured data in your contract, kind of like a database.

## Verejné (public) polia
## Public Arrays

Pole môžeš deklarovať ako `public`. V takom prípade pre ne Solidity automaticky vytvorí **_getter_** metódu. Syntax je nasledovná:
You can declare an array as `public`, and Solidity will automatically create a **_getter_** method for it. The syntax looks like:

```
Person[] public people;
```

Iné kontrakty by potom mohli dáta z toho poľa čítať (no nie do neho zapisovať). Je to užitočný programovací vzor pre ukladanie dát do našeho kontraktu.
Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Vyskúšaj si to sám
# Put it to the test

Chceme aby naša aplikácia udržiavala informáciu o armáde všetkých zombie. Ďalej chcem aby ostatné aplikácie taktiež mali k našim zombie prístup, takže chceme aby zombie boli verejný.
We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

1. Vytvor verejné `public` pole `Zombie` štruktúr (**_structs_**) s názvom `zombies`.
1. Create a public array of `Zombie` **_structs_**, and name it `zombies`.
