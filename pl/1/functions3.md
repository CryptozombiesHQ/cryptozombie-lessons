---
title: Więcej o Funkcjach
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

          //zacznij tutaj

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

          }

      }
---

W tym rozdziale nauczymy się o tym co zwracają funkcje **_return values_**, oraz o modyfikatorach funkcji.

## Return Values

Deklaracja funkcji zwracającej jakąś wartość wygląda następująco:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

W Solidity, w deklaracji funkcji trzeba napisać jaki typ zmiennej będzie zwracany (w naszym przypadku `string`).

## Modyfikatory funkcji

Powyższa funkcja nie zmienia stanu w Solidity — nie zmiania żadnej wartości, ani nie zapisuje niczego.

W takim przypadku możemy zadeklarować ją jako **_view_**. Oznacza to, że funkcja wyświetla tylko dane, ale nie modyfikuje ich:

```
function sayHello() public view returns (string) {
```

Solidity zawiera również "czyste" **_pure_** funkcje. Oznacza to, że nie wykorzystuje się w nich żadnych danych z aplikacji. Rozważmy powyższy przykład:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Funkcja nie czyta żadnego stanu aplikacji — wartość którą zwraca zależy tylko od jej parametrów. W takim przypadku możemy zadeklarować taką funkcje jako **_pure_**.

> Notatka: Może to być trudne do zapamiętania kiedy oznaczać funkcje pure/view. Na szczęście kompilator Solidity jest na tyle mądry, że zwraca ostrzeżenia podczas kompilacji.

# Zadanie do wykonania

Chcemy stworzyć pomocniczą funkcje, która wygeneruje losowe DNA na podstawie string-a.

1. Stwórz `private` funkcje o nazwie `_generatePseudoRandomDna`. Powinna przyjmować jeden parametr `_str` ( `string`) i zwracać `uint`.

2. Ta funkcja będzie wyświetlała dane z naszego kontraktu, ale nie będzie ich modyfikowała. Oznacz ją jako `view`.

3. The function body should be empty at this point — we'll fill it in later.
