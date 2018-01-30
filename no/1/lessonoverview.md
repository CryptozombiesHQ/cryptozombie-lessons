---
title: Leksjon oversikt
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

I leksjon 1, kommer du til å lage en "Zombie Factory" for å bygge en hel gjeng med zombier.

* Fabrikken vår kommer til å vedlikeholde en database av alle zombier 
* Fabrikken kommer til å ha en funksjon for å lage nye zombier
* Hver zombie kommer til å ha et tilfeldig og unikt utseende

I senere leksjoner, kommer vi til å legge til flere funksjoner, som for eksempel muligheten til å angripe mennesker eller andre zombier! Men før det,  må vi legge til de grunnlegende funksjonene for å lage nye zombier.

## Hvordan Zombie DNA virker

Zombiens utseende vil være basert på dens "Zombie DNA". Zombie DNA er enkelt — det er en 16-sifret integer, for eksempel:

```
8356281049284737
```

Akuratt som et ekte DNA, forskjellige deler av dette sifferet vil gi forskjellige trekk. De to første sifrene endrer hvilket type hode den har, de to neste endrer zombiens øyne, etc.

> Noter: I denne leksjonen har vi holdt ting til det simple, og zombiene våre kan bare ha 7 forskjellige type hoder (selv om 2 sifre git mulighet for 100 forskjellige muligheter). Senere kan vi legge til flere forskjellige typer hoder for å øke antallet forskjellige zombier vi kan få.

For eksempel, de to første sifrene i eksempel DNA-et over er `83`. For å endre zombiens hode-type, gjør noe slik: `83 % 7 + 1` = 7. Slik vil Zombien ha det syvende type hode. 

I panelet til høyre, endre `head gene` blidebryteren slik at vi viser det 7-ende hode (julenisse-hatten) for å se hvilke trekk `83` korresponderer til.

# Test det

1. Prøv deg frem med glidebryteren til høyre på siden. Eksperimenter deg frem for å se hvordan de numeriske verdiene korresponderer med de forskjellige aspektene til zombiens utseende.

Ok, nok leking. Når du er klar, klikk "Next Chapter" nedenfor, og la oss ta et dypdykk inn i Solidity!
