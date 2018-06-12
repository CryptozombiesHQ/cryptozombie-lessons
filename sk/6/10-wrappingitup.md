---
title: Wrapping It Up
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

Gratulujem! Podarilo sa ti úspešne napísať tvoju prvý Web3.js front end aplikáciu, ktorá komunikuje so smart kontraktom.
Congratulations! You've successfully written your first Web3.js front-end that interacts with your smart contract.

Ako odmenu dostaneš nového zombie `The Phantom of Web3`! Je to zombie Level 3.0 (ako Web 3.0 😉), s maskou lýšky. Očekuj si ho tu vpravo.
As a reward, you get your very own `The Phantom of Web3` zombie! Level 3.0 (for Web 3.0 😉), complete with fox mask. Check him out to the right.

## Ďalšie kroky
## Next Steps

Táto lekcia bola účelovo len základná. Chceli sme ti ukázať hlavnú logiku ktorú musíš naimplementovať, aby tvoja aplikácia mohla komunikovať so smart kontraktom. Nechceli sme však stráviť príliš veľa času kompletnou implementáciou, pretože Web3.js oblasť kódu sa celkom opakuje. Aj keby sme pokračovali v implementácií dalšej funkcionality spojenej s web3, nič nové by sme sa už nenaučili.
This lesson was intentionally basic. We wanted to show you the core logic you would need in order to interact with your smart contract, but didn't want to take up too much time in order to do a full implementation since the Web3.js portion of the code is quite repetitive, and we wouldn't be introducing any new concepts by making this lesson any longer.

Preto sme nechali túto implementáciu pomerne strohú. Tu je zoznam nápadov vecí, ktoré by sme mohli ešte ďalej doimplementovať do našeho front endu. Ak chceš, nechaj sa inšpirovať a naprogramuj si Zombie hru s takýmito vylepšeniami:
So we've left this implementation bare-bones. Here's a checklist of ideas for things we would want to implement in order to make our front-end a full implementation for our zombie game, if you want to run with this and build it on your own:

1. Naimplemetuj funkcie pre  `attack`, `changeName`, `changeDna` a ERC721 funkcie `transfer`, `ownerOf`, `balanceOf`, atd. Implementácia týchto funkcií by bola identická so všetkými ostatnými `send` transakciami o ktorých sme doposiaľ hovorili.
1. Implementing functions for `attack`, `changeName`, `changeDna`, and the ERC721 functions `transfer`, `ownerOf`, `balanceOf`, etc. The implementation of these functions would be identical to all the other `send` transactions we covered.

2. Implementácia administrátorského rozhrania, cez ktoré by si mohl volať funkcie `setKittyContractAddress`, `setLevelUpFee` a `withdraw`. Ani tieto funkcie by nemali nejakú špeciálnu logiku. Opäť by to boli funkcie veľmi pododbné tým, ktoré sme doposiaľ napísali. Mal by si sa uitiť, že tieto funkcie by boli volané z rovnakej Ethereum adresy, ako tej, z ktorej bol kontrakt nasadený.
2. Implementing an "admin page" where you can execute `setKittyContractAddress`, `setLevelUpFee`, and `withdraw`. Again, there's no special logic on the front-end here — these implementations would be identical to the functions we've already covered. You would just have to make sure you called them from the same Ethereum address that deployed the contract, since they have the `onlyOwner` modifier.

3. Ďalej máme pár nápadov na rozličné front end pohľady, ktoré by sa dali naprogramovať:
3. There are a few different views in the app we would want to implement:

  a. Stránka jedného individuálneho zombie. Na tejto stránke by bolo možné zistit detailné informácie o špecifickom zombie, stránka by mala permalink. Zobrazovala by vzhľad zombie, jeho meno, vlastníka (s linkom na profil účtu vlastníka), jeho pomer víťazstiev a prehier, atď.
  a. An individual zombie page, where you can view info about a specific zombie with a permalink to it. This page would render the zombie's appearance, show its name, its owner (with a link to the user's profile page), its win/loss count, its battle history, etc.

  b. Stránku užívateľa s permalinkom, na ktorej by bolo možné si pozrieť celú zombie armádu špecifického hráča. Cez túto stránku by si taktiež kliknutím mohol napadnúť jeho zombies, ak by si bol zalogovaný do MetaMasku, a mal k dispozícií nejakých zombie.
  b. A user page, where you could view a user's zombie army with a permalink. You would be able to click on an individual zombie to view its page, and also click on a zombie to attack it if you're logged into MetaMask and have an army.

  c. Domovská stránka, na ktorej by sa zobrazila zombie armáda aktuálneho hráča. (Toto je stránka ktorú sme začali písať v index.html súbore).
  c. A homepage, which is a variation of the user page that shows the current user's zombie army. (This is the page we started implementing in index.html).

4. Implementovať možnosť kŕmiť svojho zombie prostredníctvom UI na CryptoKitties. Mohli by sme mať napríklad tlačítko pri každom zombie, na ktorom by bolo napísané "Nakŕm ma". Pri kliknutí by sme potom vyzvali užívateľa, aby zadali ID mačky (prípadne jej URL, napríklad: <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Potom by sme zavolali funkciu `feedOnKitty`.
4. Some method in the UI that allows the user to feed on CryptoKitties. We could have a button by each zombie on the homepage that says "Feed Me", then a text box that prompted the user to enter a kitty's ID (or a URL to that kitty, e.g. <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). This would then trigger our function `feedOnKitty`.

5. Nejakú metódu, ako by užívateľ cez UI mohol útočiť na zombie iných užívateľov.
5. Some method in the UI for the user to attack another user's zombie.

  Jeden z možných spôsobov, ako by sme to mohli spraviť je taký, že keď by užívateľ prehliadal zombie iného užívateľa, zobrazili by sme pri ňom tlačidlo "Npadnúť tohoto zombie". Ak by naň užívateľ klikol, zobrazilo by sa vyskakovacie okno na ktorom by si užívateľ zo svojej armády vybral zombie, ktorého chce poslať na útok.
  One way to implement this would be when the user was browsing another user's page, there could be a button that said "Attack This Zombie". When the user clicked it, it would pop up a modal that contains the current user's zombie army and prompt them "Which zombie would you like to attack with?"

  Na domovskej stránke by sa vedľa vlastnených zombie mohlo byť tlačidlo "Zautočiť". Keď ho užívateľ stlačil, mohlo by vyskočiť okienko v ktorom by mohol hľadať obete útoku podľa ID. Prípadne by mohla byť k dispozícií možnosť "Napadnúť náhodného zombie".
  The user's homepage could also have a button by each of their zombies that said "Attack a Zombie". When they clicked it, it could pop up a modal with a search field where they could type in a zombie's ID to search for it. Or an option that said "Attack Random Zombie", which would search a random number for them.

  Mohli by sme taktiež zatmaviť zombie užívateľa, v prípade že ešte nie je pripravený k útoku z dôvodu odpočinku po poslednom zápase. Užívateľ by tak hneď videl či už môže zombieho použiť na útok, prípadne ako dlho si ešte musí počkať.
  We would also want to grey out the user's zombies whose cooldown period had not yet passed, so the UI could indicate to the user that they can't yet attack with that zombie, and how long they will have to wait.

6. Na domovskej stránke by taktiež mohli byť možnosti každému zombie zmeniť meno, DNA a zvýšiť level (za poplatok). Možnosti by boli zašednuté v prípade, že daný zombie užívateľa ešte nedosiahol požadovaný level. 
6. The user's homepage would also have options by each zombie to change name, change DNA, and level up (for a fee). Options would be greyed out if the user wasn't yet high enough level.

7. Pre nových užívateľov by sme mali zobraziť uvítaciu správu s výzvou k vytoreniu ich prvého zombie. Zavolali by sme tu funkciu `createRandomZombie()`.
7. For new users, we should display a welcome message with a prompt to create the first zombie in their army, which calls `createRandomZombie()`.

8. Pravdepodobne by sme taktiež mali pridať udalosť `Attack` do našeho smart kontraktu. Táto udalosť by zaznamenala adresu užívateľa ako `indexed` parameter, tak ako sme si o tom hovorili v predošlej kapitole. Toto by umožnilo notifikácie v reálnom čase, takže by si mohli pozrieť zombieho ktorý ich napadol a nejakým spôsobom reagovať.
8. We'd probably want to add an `Attack` event to our smart contract with the user's `address` as an `indexed` property, as discussed in the last chapter. This would allow us to build real-time notifications — we could show the user a popup alert when one of their zombies was attacked, so they could view the user/zombie who attacked them and retaliate.

9. Ďalej by sme asi potrebovali naimplementovať určitú vyrovnávaciu pamäť na front end aplikácie, aby sme príliš nevyťažili Infuru s opakovanými dotazmi na rovnaké dáta. (Naša aktuálna implementácia `displayZombies` volá `getZombieDetails` pre každého jedného zombie, zakaždým keď obnovíme stránku - kdežto v skutočnosti by nám malo stačiť volať túto metódu len vtedy, keď je pridaný nový zombie do našej armády).
9. We would probably also want to implement some sort of front-end caching layer so we aren't always slamming Infura with requests for the same data. (Our current implementation of `displayZombies` calls `getZombieDetails` for every single zombie every time we refresh the interface — but realistically we only need to call this for the new zombie that's been added to our army).

10. Chatovaciu miestnosť v reálnom čase, nech sa hráči môžu navzájom zastrašovat kto komu rozpráši armádu.
10. A real-time chat room so you could trash talk other players as you crush their zombie army? Yes plz.

A to je len začiatok - som si istý že by sa dalo vymyslieť ešte oveľa viac funkcií. Už teraz máme obrovský zoznam.
That's just a start — I'm sure we could come up with even more features — and already it's a massive list.

Kedže pre vytvorenie takéhoto webového rozrania by sme potrebovali napísať veľa front-end kódu (HTML, CSS, Javascript, framework ako React alebo Vue.js), tvorba kompletného frontedu by zabrala osobitný kurz s aspoň 10 lekciami. Túto implementáciu teda necháme na tebe.
Since there's a lot of front-end code that would go into creating a full interface like this (HTML, CSS, JavaScript and a framework like React or Vue.js), building out this entire front-end would probably be an entire course with 10 lessons in itself. So we'll leave the awesome implementation to you.

> Poznámka: Napriek tomu že sú smart kontrakty decentralizované, náš front end pre interakciu s našou DAppkou by bol kompletne centralizovaný na nejakom webovom serveri.
> Note: Even though our smart contract is decentralized, this front-end for interacting with our DApp would be totally centralized on our web-server somewhere.
>
> Každopádne, pomocou SDK, na akom pracujeme v <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, budeš už čoskoro schopný pobežať front endy ako je tento na svojej vlastne DappChaine, namiesto centralizovaného serveru. Tým pádom, medzi Ethereum a Loom DAppChain bude tvoja DAppka 100% bežať len na blockchain.
> However, with the SDK we're building at <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, soon you'll be able to serve front-ends like this from their own DAppChain instead of a centralized web server. That way between Ethereum and the Loom DAppChain, your entire app would run 100% on the blockchain.

## Záver
## Conclusion

Týmto si dovŕšil Lekciu 6. Teraz máš všetky vedomosti potrebné na vytvorenie vlastného smart kontraktu a frontedu, ktorý s ním užívateľom umožní pracovať!
This concludes Lesson 6. You now have all the skills you need to code a smart contract and a front-end that allows users to interact with it!

V ďalšej lekcii sa pozrieme na záverečný kúsok skladačky - nasadzovanie smart kontraktov na Ethereum blockchain.
In the next lesson, we're going to be covering the final missing piece in this puzzle — deploying your smart contracts to Ethereum.

Klikni na "Ďalšia Kapitola" pre vyzdvihnutie tvojej odmeny!
Go ahead and click "Next Chapter" to claim your rewards!
