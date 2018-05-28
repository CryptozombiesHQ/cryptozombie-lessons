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

Kod Solidity zawarty jest w **kontraktach**. `Kontrakt` jest fundamentalnym blokiem budującym aplikacje oparte na Ethereum — wszystkie zmienne i funkcje należą do kontraktu i to będzie punkt wyjścia dla wszystkich Twoich projektów.

Pusty kontrakt `HelloWorld` wygląda następująco:

    contract HelloWorld {
    
    }
    

## Wersja Pragma

Kod źródłowy Solidity zaczyna się poprzez "wersję pragma" — deklarację wersji kompilatora Solidity, którego nasz kod będzie używał. Stosuje się to aby zapobiec problemom z przyszłymi wersjami, które moga potencjalnie zawierać zmiany kolidujące z Twoim kodem.

Wygląda to tak: `pragma solidity ^0.4.19;` (dla aktualnej wersji Solidity, w trakcie pisania tego tekstu, 0.4.19).

Sklejając to w całość, poniżej mamy elementarną formę kontraktu — pierwszą rzecz, którą napiszesz, zaczynając nowy projekt:

    pragma solidity ^0.4.19;
    
    contract HelloWorld {
    
    }
    

# Wypróbujmy zatem

Aby zacząć tworzyć naszą armię Zombiaków, utwórzmy najpierw startowy kontrakt o nazwie `ZombieFactory`.

1. W oknie obok, spraw aby nasz kontrakt używał wersji Solidity `0.4.19`.

2. Utwórz pusty kontrakt o nazwie `ZombieFactory`.

Kiedy skończysz, kliknij "sprawdź odpowiedź" poniżej. Jeżeli utkniesz, możesz uzyskać podpowiedź klikając w przycisk "podpowiedź".