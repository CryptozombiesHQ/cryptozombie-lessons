---
title: Hotovo!
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  saveZombie: false
  zombieDeck:
    zombie:
      lesson: 6
    hideSliders: true
    answer: 1
---

Gratulujeme!!! Podarilo sa ti úspešne napísať svoju prvý Web3.js front end aplikáciu komunikujúcu so smart kontraktom na blockchaine.

Ako odmenu dostaneš nového zombie `The Phantom of Web3`! Je to zombie Level 3.0 (ako Web 3.0 😉) s maskou lýšky. Očekuj si ho vpravo.

## Ďalšie kroky

Táto lekcia bola účelovo len základná. Chceli sme ti ukázať hlavnú logiku ktorú musíš naimplementovať, aby tvoja aplikácia mohla komunikovať so smart kontraktom. Nechceli sme však stráviť príliš veľa času kompletnou implementáciou, pretože Web3.js oblasť kódu sa celkom opakuje. Aj keby sme pokračovali v implementácií dalšej funkcionality spojenej s web3, nič nové by sme sa už nenaučili.

Preto sme nechali túto implementáciu pomerne strohú. Tu je zoznam nápadov, ktoré by sme mohli ešte ďalej doimplementovať do našeho front endu. Ak chceš, nechaj sa inšpirovať a naprogramuj si Zombie hru s takýmito vylepšeniami:

1. Naimplemetuj funkcie pre `attack`, `changeName`, `changeDna` a ERC721 funkcie `transfer`, `ownerOf`, `balanceOf`, atd. Implementácia týchto funkcií by bola identická so všetkými ostatnými `send` transakciami o ktorých sme doposiaľ hovorili.

2. Implementácia administrátorského rozhrania, cez ktoré by si mohol volať funkcie `setKittyContractAddress`, `setLevelUpFee` a `withdraw`. Ani tieto funkcie by nemali nejakú špeciálnu logiku. Opäť by to boli funkcie veľmi pododbné tým, ktoré sme doposiaľ napísali. Mal by si sa uitiť, že tieto funkcie by boli volané z rovnakej Ethereum adresy, ako tej, z ktorej bol kontrakt nasadený.

3. Ďalej máme pár nápadov na rozličné stránku front endu, ktoré by sa mohli pridať:

  a. Stránka jedného individuálneho zombie. Na tejto stránke by bolo možné zistit detailné informácie o špecifickom zombie, stránka by mala permalink. Zobrazovala by vzhľad zombie, jeho meno, vlastníka (s linkom na profil účtu vlastníka), jeho pomer víťazstiev a prehier, atď.

  b. Stránku užívateľa s permalinkom, na ktorej by bolo možné si pozrieť celú zombie armádu špecifického hráča. Cez túto stránku by si taktiež kliknutím mohol napadnúť jeho zombies, ak by si bol zalogovaný do MetaMasku, a mal k dispozícií nejakých zombie.

  c. Domovská stránka, na ktorej by sa zobrazila zombie armáda aktuálneho hráča. (Toto je stránka ktorú sme začali písať v index.html súbore).

4. Implementovať možnosť kŕmiť svojho zombie prostredníctvom UI na CryptoKitties. Mohli by sme mať napríklad tlačítko pri každom zombie, na ktorom by bolo napísané "Nakŕm ma". Pri kliknutí by sme potom vyzvali užívateľa, aby zadali ID mačky (prípadne jej URL, napríklad: <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Potom by sme zavolali funkciu `feedOnKitty`.

5. Nejakú metódu, ako by užívateľ cez UI mohol útočiť na zombie iných užívateľov.

  Jeden z možných spôsobov, ako by sme to mohli spraviť je taký, že keď by užívateľ prehliadal zombie iného užívateľa, zobrazili by sme pri ňom tlačidlo "Npadnúť tohoto zombie". Ak by naň užívateľ klikol, zobrazilo by sa vyskakovacie okno na ktorom by si užívateľ zo svojej armády vybral zombie, ktorého chce poslať na útok.

  Na domovskej stránke by sa vedľa vlastnených zombie mohlo byť tlačidlo "Zautočiť". Keď ho užívateľ stlačil, mohlo by vyskočiť okienko v ktorom by mohol hľadať obete útoku podľa ID. Prípadne by mohla byť k dispozícií možnosť "Napadnúť náhodného zombie".

  Mohli by sme taktiež zatmaviť zombie užívateľa, v prípade že ešte nie je pripravený k útoku z dôvodu odpočinku po poslednom zápase. Užívateľ by tak hneď videl či už môže zombieho použiť na útok, prípadne ako dlho si ešte musí počkať.

6. Na domovskej stránke by taktiež mohli byť možnosti každému zombie zmeniť meno, DNA a zvýšiť level (za poplatok). Možnosti by boli zašednuté v prípade, že daný zombie užívateľa ešte nedosiahol požadovaný level. 

7. Pre nových užívateľov by sme mali zobraziť uvítaciu správu s výzvou k vytoreniu ich prvého zombie. Zavolali by sme tu funkciu `createRandomZombie()`.

8. Pravdepodobne by sme taktiež mali pridať udalosť `Attack` do našeho smart kontraktu. Táto udalosť by zaznamenala adresu užívateľa ako `indexed` parameter, tak ako sme si o tom hovorili v predošlej kapitole. Toto by umožnilo notifikácie v reálnom čase, takže by si mohli pozrieť zombieho ktorý ich napadol a nejakým spôsobom reagovať.

9. Ďalej by sme asi potrebovali naimplementovať určitú vyrovnávaciu pamäť na front ende aplikácie, aby sme príliš nevyťažili Infuru opakovanými dotazmi na rovnaké dáta. (Naša aktuálna implementácia `displayZombies` volá `getZombieDetails` pre každého jedného zombie, zakaždým keď obnovíme stránku - kdežto v skutočnosti by nám malo stačiť volať túto metódu len vtedy, keď je pridaný nový zombie do našej armády).

10. Chatovaciu miestnosť v reálnom čase, nech sa hráči môžu navzájom zastrašovat kto komu rozpráši armádu.

A to je len začiatok - som si istý že by sa dalo vymyslieť ešte oveľa viac funkcií. Už teraz máme obrovský zoznam.

Kedže pre vytvorenie takéhoto webového rozrania by sme potrebovali napísať veľa front-end kódu (HTML, CSS, JavaScript, framework ako React alebo Vue.js), tvorba kompletného frontedu by zabrala osobitný kurz s aspoň 10 lekciami. Túto implementáciu teda necháme na tebe.

> Poznámka: Napriek tomu že sú smart kontrakty decentralizované, náš front end pre interakciu s našou DAppkou by bol kompletne centralizovaný na nejakom webovom serveri.
>
> Každopádne, pomocou SDK na akom pracujeme v <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, budeš už čoskoro schopný pobežať front endy ako je tento na svojej vlastne DappChaine, namiesto centralizovaného serveru. Tým pádom, medzi Ethereum a Loom DAppChain bude tvoja DAppka 100% bežať len na blockchain.

## Záver

Týmto si dovŕšil Lekciu 6. Teraz máš všetky vedomosti potrebné na vytvorenie vlastného smart kontraktu a frontedu, ktorý s ním užívateľom umožní pracovať!

V ďalšej lekcii sa pozrieme na záverečný kúsok skladačky - nasadzovanie smart kontraktov na Ethereum blockchain.

Klikni na "Ďalšia Kapitola" pre vyzdvihnutie svojej zaslúženej odmeny!
