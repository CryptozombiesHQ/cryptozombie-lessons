---
title: Stavové premenné a celé čísla
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Dobrá práca! Teraz keď už máme kostru našeho kontraktu, poďme sa naučiť ako sa Solidity správa ku premenným.


**Stavové premenné** su permanentne uložené v dátovom uložisku kontraktu. To znamená, že su zapísané na Ethereum blockchaine. Zapisovanie do nich môžeš vnímať ako zapisovanie do databáze.

##### Príklad:
```
contract Example {
  // Hodnota tejto premennej bude permentne uložená v blockchaine
  uint myUnsignedInteger = 100;
}
```

V tomto ukážkovom kontrakte sme deklarovali premennú `myUnsignedInteger` typu `uint`. Jej hodnotu sme nastavili na 100.

## Celé čísla bez znamienka: `uint`

Dátový typ `uint` reprezentuje celé číslo bez znamienka. To znamená že môže nadobudnúť len nezáporné hodnoty. Existuje taktiež dátový typ `int`, ktorý reprezentuje čisla so znamienkom.  

> Poznámka: V Solidity je `uint` v skutočnosti len skratka pre `uint256`, čo je 256 bitové bezznamienkové čislo. Je možné taktiež deklarovať uinty s menším počtom bitov - `uint8`, `uint16`, `uint32`, a podobne. Obecne je však doporučené, až na určité špecifické prípady, používať `uint`. O tých špeciálnych prípadoch si povieme v neskorších lekciách.

# Vyskúšaj si to sám

Naše Zombie DNA bude určené 16 ciferným číslom.

Deklaruj `uint` pomenovaný `dnaDigits` a nastav jeho hodnotu na `16`. 
