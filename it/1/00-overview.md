---
title: Testing Smart Contracts with Truffle
header: Testing Smart Contracts with Truffle
roadmap: roadmap.jpg
path: solidity_advanced
position: 1
publishedOn: Cryptozombies
---

Welcome! By completing the previous lessons you’ve demonstrated that you really know your stuff.

So, go ahead and deploy the game to the mainnet. Enjoy your success!

Hang on a moment... There are a _few things_ you might have already thought of. After all, once contracts get deployed to the mainnet, they will live there forever. If there are mistakes in them, they will still live on as well. Like undead zombies.

Mistakes, or _**bugs**_, happen to every coder, no matter how skilled. It's unlikely that you would make a major mistake like giving attacking zombies a 100% chance of victory, but it could happen.

Clearly giving the attacking side 100% of wins would mean what you had written was no longer a game, or even any fun at all. A bug like this would kill your game dead, and no promise of juicy brains would drag your zombies from their graves.

To stop this terrible thing from happening, it is essential that you thoroughly test every aspect of the game.

By the end of this lesson, you will be able to:

- Test your smart contracts with `Truffle` against `Ganache`
- Use `Chai` to write more expressive assertions
- Test against `Loom`😉

Let's get started!
