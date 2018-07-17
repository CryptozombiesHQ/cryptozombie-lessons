---
title: "Kontrakty"
actions: ['sprawdźOdpowiedź', 'podpowiedzi']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Create contract here
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Zacznijmy od absolutnych podstaw:

Kod Solidity znajduje się w **kontraktach**. Kontrakt `contract` jest podstawową konstrukcją z jakiej zbudowana jest aplikacja na Ethereum. Wszystkie zmienne, oraz funkcje należą do kontraktu. To będzie twój punkt wyjściowy przy pisaniu wszystkich późniejszych projektów

Pusty kontrakt o nazwie `HelloWorld` wygląda tak:

```
contract HelloWorld {

}
```

## Version Pragma

Kod źródłowy Solidity powinien zaczynać się od "version pragma", czyli deklaracji wersji dla kompilera Solidity. Jest to niezbędne aby wyeliminować ewentualne przyszłe błedy jeśli zmieni się wersja kompilera.

Powinno to wyglądać mniej więcej tak: `pragma solidity ^0.4.19;` ( 0.4.19 jest aktualną wersją w czasie pisania tego tutorialu).

Zbierając wszystko w jedną całość, oto szkielet każdego początkowego kontraktu — pierwsza rzecz jaką powinieneś napisać, kiedy tworzysz nowy projekt:

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Zadanie do wykonania

Aby stworzyć armię zombie, stwórzmy najpierw podstawowy kontrakt o nazwie `ZombieFactory`.

1. W edytorze po prawej, spraw aby kontrakt używał wersji `0.4.19`.

2. Stwórz pusty projekt o nazwie `ZombieFactory`.

Kiedy skończysz, kliknij "sprawdź odpowiedź" poniżej. Jeśli utkniesz, możesz kliknąć "podpowiedzi".
