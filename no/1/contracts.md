---
title: "Kontrakter"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Legg til solidity versjon her

      //2. Lag kontrakt her
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Start med det absolutt grunnleggende:

Solidity's er innkapslet av **contracts**. En `contract` er en fundamental grunnsten i Ethereum applikasjoner — alle variabler og funksjoner tilhører en kontrakt, og dette vil være startpunktet for alle dine prosjekter.

En tom kontrakt kalt `HelloWorld` vil se slik ut:

```
contract HelloWorld {

}
```

## Versjon Pragma

Alle solidity dokumenter bør starte med "version pragma" — en deklararsjon av versjonen til Solidity kompilatoren skal bruke. Dette er for å unngå problemer med fremtidige kompilator-versjoner som potensielt kan bryte koden din.

Det ser slik ut: `pragma solidity ^0.4.19;` (fordi den nyeste versjonen av Solidity i skrivende stund er 0.4.19).

Putt alt sammen og du har en et skjellett til et prosjekt — det første du kommer til å skrive hver gang du lager et nytt prosjekt.

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Test det

For å lage Zombie-ene våre, la oss lage en base-kontrakt kalt `ZombieFactory`.

1. I boksen til høyre, gjør det slik at solidity bruker versjon `0.4.19`.

2. Lag en tom kontrakt kalt `ZombieFactory`.

Når du er ferdig, klikk "check answer" nedenfor. Hvis du sitter fast kan du klikke på "hint".
