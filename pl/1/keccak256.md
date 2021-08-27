---
title: Keccak256 i Typowanie
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
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

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              // zacznij tutaj
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Chcemy, aby nasza funkcja `_generatePseudoRandomDna` zwracała pseudo losową liczbę naturalną `uint`. W jaki sposób możemy to osiągnąć?

W Ethereum wbudowana jest funka hashująca `keccak256`, która jest odmianą funkcji SHA3. Funkcja hashująca mapuje ciąg znaków (string) na 256-bit heksadecymalny numer. Mała zmiana wejściowego stringa powoduje całkowitą zmianę wyniku funkcji.


Jest to bardzo przydatne w wielu przypadkach w Ethereum, ale narazie użyjmy jej do wygenerowania psedo-losowej liczby.

Przykład:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Jak widzisz, zwracana wartość jest kompletnie inna, pomimo że zmieniliśmy tylko jeden znak.

> Notatka: **Bezpieczna** generacja losowych znaków w blockchainie jest dużym problemem. Nasza metoda nie jest bezpieczna, ale bezpieczeństwo nie jest priorytetem przy generowaniu Zombie DNA. Jest ono na wystarczającym poziomie, jak na nasze potrzeby.

## Typowanie

Czasami potrzebujesz przekonwertować dane pomiędzy typami. Zerknij na poniższy przykład:

```
uint8 a = 5;
uint b = 6;
// rzuć wyjątek ponieważ a * b zwraca uint, a nie uint8:
uint8 c = a * b; 
// musimy typować zmienną b na uint8 aby przykład zadziałał:
uint8 c = a * uint8(b); 
```

W powyższym przykładzie, `a * b` zwraca `uint`, ale my próbujemy zapisać to jako`uint8`. Stwarza to  problem. Po zmianie typy na `uint8`, wszystko działa i kompilator nie zwraca żadnego błędu.

#  Zadanie do wykonania

Uzupełnijmy naszą funkcję `_generatePseudoRandomDna` ! Oto co powinniśmy zrobić:

1. W pierwszej linijce wywołaj funkcję `keccak256` na  `_str` aby wygenerować pseudo-losową heksadecymalną liczbę. Zmień jej typ na uint i zapisz rezultat jako `uint` o nazwie `rand`.

2. Chcemy aby nasze DNA miało tylko 16 znaków (pamiętasz nasze `dnaModulus`?). Więc druga linia powinna `zwracac` powyższą wartość modulo (`%`) `dnaModulus`.
