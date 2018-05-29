---
title: Więcej o funkcjach
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
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      uint dnaDigits = 16; uint dnaModulus = 10 ** dnaDigits;
      struct Zombie { string name; uint dna; }
      Zombie[] public zombies;
      function _createZombie(string _name, uint _dna) private { zombies.push(Zombie(_name, _dna)); }
      function _generateRandomDna(string _str) private view returns (uint) {
      }
      }
---
W tym rozdziale nauczymy się nieco o ***wartościach zwracanych</strong>* przez funkcje i o modyfikatorach funkcji.</p> 

## Wartości zwracane

Aby zwrócić wartość z funkcji, deklaracja wygląda tak:

    string greeting = "What's up dog";
    
    function sayHello() public returns (string) {
      return greeting;
    }
    

W Solidity, deklaracja funkcji zawiera typ wartości zwracanej (w tym przypadku `string`).

## Modyfikatory funkcji

Powyższa funkcja, tak właściwie nie zmienia stanu — tzn. nie zmienia żadnej wartości ani niczego nie zapisuje.

Więc w tym przypadku powinniśmy zadeklarować ją jako ***view***, co oznacza, że jest to funkcja tylko do odczytu danych, ale nie modyfikowania ich:

    function sayHello() public view returns (string) {
    

Solidity posiada również funkcje ***pure***, co oznacza, że nie masz dostępu do danych w aplikacji. Rozważmy następującą rzecz:

    function _multiply(uint a, uint b) private pure returns (uint) {
      return a * b;
    }
    

Ta funkcja nie odczytuje nawet ze stanu aplikacji — jej zwracana wartość zależy od jej parametrów. Więc w takim wypadku deklarujemy funkcję jako ***pure***.

> Uwaga: Może być trudne do zapamiętania to, kiedy oznaczać funkcje jako pure/view. Na szczęście, kompilator Solidity jest dobry pod względem wydawania ostrzeżeń i napewno da Ci znać, kiedy powinienieś użyć jednego z tych modyfikatorów.

# Wypróbujmy zatem

Zamierzamy mieć funkcję pomocniczą, która generuje losowe DNA z ciągu znaków (ze stringu).

1. Stwórz `prywatną` funkcję o nazwie `_generateRandomDna`. Powinna ona mieć jeden parametr o nazwie `_str` typu (`string`) i zwracać wartość `uint`.

2. Ta funkcja będzie pokazywała niektóre ze zmiennych naszego kontraktu, ale nie modyfikowała ich, więc oznacz ją jako `view`.

3. Ciało funkcji pozostaw narazie puste — uzupełnimy je później.