---
title: "Kontrakty"
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Wpisz tutaj wersję Solidity
      
      //2. Tutaj utwórz kontrakt
    answer: >
      pragma solidity ^0.4.19;
      
      contract ZombieFactory {
      }
---
Zacznijmy od całkowitych podstaw:

Kod Solidity ujęty jest w **kontraktach**. `Kontrakt` jest fundamentalnym blokiem budującym aplikacje oparte na Ethereum — wszystkie zmienne i funkcje należą do kontraktu i to będzie punkt wyjścia dla wszystkich Twoich projektów.

Pusty kontrakt `HelloWorld` wygląda następująco:

    contract HelloWorld {
    
    }
    

## Wersja Pragma

Kod źródłowy Solidity zaczyna się poprzez "wersję pragma" — deklarację wersji kompilatora Solidity, którego nasz kod będzie używał. Stosuje się to aby zapobiec problemom z przyszłymi wersjami, które moga potencjalnie zawierać zmiany kolidujące z Twoim kodem.

Wygląda to tak: `pragma solidity ^0.4.19;` (dla aktualnej wersji Solidity, w trakcie pisania tego tekstu, 0.4.19).

Sklejając to w całość, poniżej mamy elementarną formę kontraktu — pierwsza rzecz, którą napiszesz, zaczynając nowy projekt:

    pragma solidity ^0.4.19;
    
    contract HelloWorld {
    
    }
    

# Wypróbujmy zatem

To start creating our Zombie army, let's create a base contract called `ZombieFactory`.

1. In the box to the right, make it so our contract uses solidity version `0.4.19`.

2. Create an empty contract called `ZombieFactory`.

When you're finished, click "check answer" below. If you get stuck, you can click "hint".