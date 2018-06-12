---
title: App Front-ends & Web3.js
header: "Lesson 6: App Front-ends & Web3.js"
roadmap: roadmap6.png
---

Kámo, až tu sa ti podarilo sa dostať?
Huh, you've made it this far?!

Ty nie si len taký obyčajný CryptoZombie...
You're no ordinary CryptoZombie...

Dokončením Lekcie 5 si demonštroval že máš solídne porozumenie Solidity.
By completing Lesson 5, you've demonstrated that you have a pretty firm grasp of Solidity.

No žiadna DAppka nie je kompletná bez možnosti užívateľov s ňou pracovať...
But no DApp is complete without a way for its users to interact with it...

V tejto lekcii sa ideme pozrieť na to, ako interagovať s našim smart kontraktom a vytvoriť jednoduchý front end našej DApp, použitím knižnice nazývanej **Web3.js**.
In this lesson, we're going to look at how to interact with your smart contract and build a basic front-end for your DApp using a library called **Web3.js**.

Front endy su písané v **Javascripte**, nie Solidity. Keďže hlavné zameranie tohoto kurzu je Ethereum / Soldity, budeme predpokladať, že už máš nejaké skúsenosti s vytváraním stránok v HTML, Javascripte (včetne ES6 <a href="https://developers.google.com/web/fundamentals/primers/promises" target=_blank>promises</a>) a JQuery. Nebudeme preto venovať čas vysvetľovaním základov týchto jazykov.
Note that app front-ends are written in **JavaScript**, not Solidity. But since the focus of this course is on Ethereum / Solidity, we're assuming you are already comfortable building websites with HTML, JavaScript (including ES6 <a href="https://developers.google.com/web/fundamentals/primers/promises" target=_blank>promises</a>), and JQuery, and will not be spending time covering the basics of those languages.

Ak sa na vytváranie stránok v HTML/Javascripte celkom necítiš, mal by si pred začatím tejto lekcie dokončiť nejaký základný tutoriál o HTML a Javascripte niekde inde.
If you are not already comfortable building websites with HTML / Javascript, you should complete a basic tutorial elsewhere before starting this lesson.
