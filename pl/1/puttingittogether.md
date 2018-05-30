---
title: Łacząc to razem...
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
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
      
      Zombie[] public zombies;
      
      function _createZombie(string _name, uint _dna) private {
      zombies.push(Zombie(_name, _dna));
      }
      
      function _generateRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
      }
      
      // zacznij tutaj
      
      }
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) { uint rand = uint(keccak256(_str)); return rand % dnaModulus; }
      function createRandomZombie(string _name) public { uint randDna = _generateRandomDna(_name); _createZombie(_name, randDna); }
      }
---
Jesteśmy bliscy ukończenia naszego generatora losowych Zombi! Stwórzmy teraz funkcję, która "spina" wszystko razem.

Zamierzamy napisać publiczną funkcję, która na wejściu pobiera nanzwę Zombiaka i używa tej nazwy do stworzenia Zombi z losowym DNA.

# Wypróbujmy zatem

1. Stwórz `publiczną` funkcję o nazwie `createRandomZombie`. Będzie ona pobierała jeden parametr o nazwie `_name` (typu `string`). *(Uwaga: Zadeklaruj tę funkcję `public` tak jak zadeklarowałeś poprzednie funkcje `private`)* 

2. Pierwsza linia tej funkcji powinna wywołać funkcję `_generateRandomDna` z argumentem `_name` i przechowywać jako `uint` o nazwie `randDna`.

3. Druga linia wywołuje funkcje `_createZombie` z argumentami `_name` i `randDna`.

4. Rozwiązaniem są 4 linie kodu (włączając w to klamrę zamykającą `}` funkcję).