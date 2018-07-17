---
title: "Kontrakty"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity // 1. Tu je potrebné špecifikovať verziu Solidity

      //2. Tu vytvor kontrakt
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Poďme začať od úplných základov:

Solidity kód je zapuzdrený v **kontraktoch**. Kľučové slovo `contract` je zakladným stavebným blokom Ethereum aplikácii - sú tu definované všetky premenné a funkcie ktoré kontraktu patria. To bude štartovací bod pre všetky naše projekty.

Prázdny kontrakt pomenovaný `HelloWorld` by vyzeral takto:

```
contract HelloWorld {

}
```

## Version Pragma

Zdrojový kód Solidity by mal začínať textom "version pragma". Je to deklarácia verzie Solidity kompilátoru, pre ktorý bol kód kontraktu napísaný. Je to mechanizmus ako predísť problémom v prípade pokusu o použitia budúcej verziu Solidity kompilátoru. V budúcnosti by sa totiž Solidity kompilátor mohol zmeniť a začat interpretovať náš kód inak. V dôsledku toho by náš kód mohol prestať fungovať správne.  

Vyzerať to môže napríklad takto:  `pragma solidity ^0.4.19;` (v čase písania tohoto tutoriálu je najnovšou Solidity verziou 0.4.19). 

Keď to celé poskladáme dokopy, dostaneme základnú kostru našeho kontraktu. Takto bude vyzerať na počiatku každý nový kontrakt ktorý vytvoríme. 

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Vyskúšaj si to sám

Na to aby sme mohli vytvoriť našu Zombie armádu, poďme najprv vytvoriť základný kontrakt pomenovaný `ZombieFactory`.

1. V textovom boxe vpravo najprv špecifikuj verziu Solidity `0.4.19`.
2. Vytvor prázdny kontrakt pomenovaný `ZombieFactory`.

Ked budeš s úlohou hotový, klikni na "Skontroluj Odpoveď" v spodnej časti stránky. Ak sa pri plnení úlohy zasekneš, použi tlačidlo "Nápoveda".
