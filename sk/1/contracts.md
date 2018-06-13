---
title: "Kontrakty"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Tu je potrebné špecifikovať verziu Solidity

      //2. Tu vytvor kontrakt
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Poďme začať od úplných základov:
Starting with the absolute basics:

Solidity kód je zapuzdrený v **kontraktoch**. Kľučové slovo `contract` je zakladným stavebným blokom Ethereum aplikácii - sú tu definované všetky premenné a funkcie ktoré kontraktu patria. To bude štartovací bod pre všetky naše projekty.
Solidity's code is encapsulated in **contracts**. A `contract` is the fundamental building block of Ethereum applications — all variables and functions belong to a contract, and this will be the starting point of all your projects.

Prázdny kontrakt pomenovaný `HelloWorld` by vyzeral takto:
An empty contract named `HelloWorld` would look like this:

```
contract HelloWorld {

}
```

## Version Pragma

Solidity zdrojový kod by mal začínať textom "version pragma" - je to deklarácia verzie Solidity kompilátoru, ktorý by mal byť použitý na kompiláciu našeho kontraktu. Je to mechanizmus ako predísť problémom v prípade pokusu o použitia budúcej verziu Solidity kompilátoru. V budúcnosti by sa totiž Solidity kompilátor zmeniť a interpretovať náš kód inak, v dôsledku čoho by náš kód prestal fungovať správne.  
All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use. This is to prevent issues with future compiler versions potentially introducing changes that would break your code.

Vyzerať to môže napríklad takto:  `pragma solidity ^0.4.19;` (v čase písania tohoto tutoriálu je najnovšou Solidity verziou 0.4.19). 
It looks like this: `pragma solidity ^0.4.19;` (for the latest solidity version at the time of this writing, 0.4.19).

Putting it together, here is a bare-bones starting contract — the first thing you'll write every time you start a new project:

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Vyskúšaj si to sám
# Put it to the test

Na to aby sme mohli vytvoriť našu Zombie armádu, poďme najprv vytvoriť základný kontrakt pomenovaný `ZombieFactory`.
To start creating our Zombie army, let's create a base contract called `ZombieFactory`.

1. V textovom boxe vpravo špecifikuj že tvoj smart kontrakt je napísaný pre solidity `0.4.19`.
1. In the box to the right, make it so our contract uses solidity version `0.4.19`.
2. Vytvor prázdny kontrakt pomenovaný `ZombieFactory`.
2. Create an empty contract called `ZombieFactory`.

Ked budeš s úlohou hotový, klikni na "skontroluj odpoveď" v spodnej časti stránky. Ak sa pri plnení úlohy zasekneš, môžeš použiť tlačidlo "nápoveda".
When you're finished, click "check answer" below. If you get stuck, you can click "hint".
