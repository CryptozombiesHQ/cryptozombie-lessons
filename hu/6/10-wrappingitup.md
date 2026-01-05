---
title: Összefoglalás
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

Gratulálok! Sikeresen megírtad az első Web3.js frontend-et, amely interakcióba lép az okosszerződéseddel.

Jutalmul megkapod a saját `A Web3 Fantomja` zombidat! 3.0 szint (a Web 3.0-ért 😉), teljes rókamaskkal. Nézd meg jobbra.

## Következő lépések

Ez a lecke szándékosan alapvető volt. Meg akartuk mutatni a fő logikát, amelyre szükséged lesz, hogy interakcióba lépj az okosszerződéseddel, de nem akartunk túl sok időt fordítani egy teljes implementációra, mivel a Web3.js rész a kódból elég ismétlődő, és nem vezetnénk be új koncepciókat, ha ezt a leckét hosszabbá tennénk.

Szóval ezt az implementációt vázlatosra hagytuk. Itt van egy ellenőrzőlista ötletekről, amelyeket implementálni szeretnénk, hogy a frontendünk teljes implementáció legyen a zombi játékunkhoz, ha szeretnéd ezt folytatni és saját magad építeni:

1. Függvények implementálása az `attack`, `changeName`, `changeDna`, és az ERC721 függvényekhez: `transfer`, `ownerOf`, `balanceOf`, stb. Ezeknek a függvényeknek az implementációja ugyanaz lenne, mint az összes többi `send` tranzakció, amit áttekintettünk.

2. Egy "admin oldal" implementálása, ahol végrehajthatod a `setKittyContractAddress`, `setLevelUpFee`, és `withdraw` függvényeket. Ismét, nincs speciális logika a frontenden — ezek az implementációk ugyanazok lennének, mint a már áttekintett függvények. Csak meg kellene győződnöd, hogy ugyanarról az Ethereum címről hívod őket, amely telepítette a szerződést, mivel van rajtuk az `onlyOwner` módosító.

3. Van néhány különböző nézet az app-ban, amelyet implementálni szeretnénk:

  a. Egy egyedi zombi oldal, ahol megtekintheted egy specifikus zombi információit egy permalinkkel. Ez az oldal megjelenítené a zombi megjelenését, mutatná a nevét, a tulajdonosát (egy linkkel a felhasználó profil oldalához), a győzelmek/vereségek számát, a csata történetét, stb.

  b. Egy felhasználó oldal, ahol megtekinthetnéd egy felhasználó zombiseregét egy permalinkkel. Kattinthatnál egy egyedi zombira, hogy megnézd az oldalát, és kattinthatnál egy zombira, hogy megtámadd, ha be vagy jelentkezve a MetaMask-ba és van sereged.

  c. Egy kezdőlap, amely a felhasználó oldal egy variációja, amely megmutatja a jelenlegi felhasználó zombiseregét. (Ez az oldal, amit elkezdtünk implementálni az index.html-ben).

4. Valamilyen módszer a UI-ban, amely lehetővé teszi a felhasználónak, hogy CryptoKitties-en táplálkozzon. Lehetne egy gomb minden zombi mellett a kezdőlapon, amely azt mondja "Táplálj meg", aztán egy szövegdoboz, amely arra kéri a felhasználót, hogy adjon meg egy macska ID-t (vagy egy URL-t arra a macskára, pl. <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). Ez akkor kiváltaná a `feedOnKitty` függvényünket.

5. Valamilyen módszer a UI-ban, hogy a felhasználó megtámadhassa egy másik felhasználó zombiját.

  Egy módja ennek az implementálásának az lenne, amikor a felhasználó egy másik felhasználó oldalát böngészi, lehetne egy gomb, amely azt mondja "Támadd meg ezt a zombit". Amikor a felhasználó rákattint, felugrik egy modális ablak, amely tartalmazza a jelenlegi felhasználó zombiseregét, és arra kéri őket: "Melyik zombival szeretnél támadni?"

  A felhasználó kezdőlapján is lehetne egy gomb minden zombi mellett, amely azt mondja "Támadj meg egy zombit". Amikor rákattintanak, felugrik egy modális ablak egy kereső mezővel, ahol beírhatnak egy zombi ID-t a kereséshez. Vagy egy opció, amely azt mondja "Támadj meg egy véletlenszerű zombit", amely véletlenszerű számot keresne nekik.

  Szürkíteni is szeretnénk a felhasználó zombijait, amelyeknek még nem telt le a cooldown periódusa, hogy a UI jelezhesse a felhasználónak, hogy még nem tudnak támadni azzal a zombival, és mennyit kell várniuk.

6. A felhasználó kezdőlapján is lennének opciók minden zombi mellett a név megváltoztatásához, DNS megváltoztatásához, és szintlépéshez (díj ellenében). Az opciók szürkék lennének, ha a felhasználó még nem elég magas szintű.

7. Új felhasználóknak meg kellene jelenítenünk egy üdvözlő üzenetet egy kéréssel, hogy hozzák létre az első zombit a seregükben, amely meghívja a `createRandomZombie()`-t.

8. Valószínűleg hozzá szeretnénk adni egy `Attack` eseményt az okosszerződésünkhöz a felhasználó `address`-ével `indexed` tulajdonságként, ahogy az utolsó fejezetben tárgyaltuk. Ez lehetővé tenné számunkra, hogy valós idejű értesítéseket építsünk — megmutathatnánk a felhasználónak egy felugró figyelmeztetést, amikor egy zombijukat megtámadták, hogy megnézhessék a felhasználót/zombit, aki megtámadta őket, és visszavághassanak.

9. Valószínűleg implementálni szeretnénk valamilyen frontend cache réteget is, hogy ne üssük mindig az Infura-t ugyanazokkal az adatokkal kapcsolatos kérésekkel. (A jelenlegi `displayZombies` implementációnk minden egyes zombihoz meghívja a `getZombieDetails`-t minden alkalommal, amikor frissítjük az interfészt — de reálisan csak az új zombihoz kellene ezt meghívnunk, amelyet hozzáadtunk a seregünkhöz).

10. Egy valós idejű csevegő szoba, hogy szidhassad a többi játékost, amikor összezúzod a zombiseregüket? Igen, kérlek.

Ez csak egy kezdet — biztos vagyok benne, hogy még több funkciót is kitalálhatnánk — és már így is egy hatalmas lista.

Mivel sok frontend kód kellene egy ilyen teljes interfész létrehozásához (HTML, CSS, JavaScript és egy keretrendszer, mint a React vagy Vue.js), ennek az egész frontendnek az építése valószínűleg egy teljes kurzus lenne 10 leckével. Szóval a fantasztikus implementációt rád bízzuk.

> Megjegyzés: Bár az okosszerződésünk decentralizált, ez a frontend a DApp-ünkkel való interakcióhoz teljesen centralizált lenne valahol a webszerverünkön.
>
> Azonban az SDK-vel, amelyet a <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>-nél építünk, hamarosan képes leszel ilyen frontend-eket szolgálni a saját DAppChain-jükről egy centralizált webszerver helyett. Így az Ethereum és a Loom DAppChain között az egész app-od 100%-ban a blokkláncon futna.

## Következtetés

Ez befejezi a 6. leckét. Most már megvannak az összes készséged, hogy kódolj egy okosszerződést és egy frontend-et, amely lehetővé teszi a felhasználóknak, hogy interakcióba lépjenek vele!

A következő leckében a hiányzó utolsó darabot fogjuk áttekinteni ebben a rejtvényben — az okosszerződéseid Ethereumra való telepítését.

Menj előre, és kattints a "Következő fejezet" gombra, hogy megszerezd a jutalmaidat!
