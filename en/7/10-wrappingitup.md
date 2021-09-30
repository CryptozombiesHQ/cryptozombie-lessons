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

Congratulations! You've successfully written your first Web3.js front-end that interacts with your smart contract.

As a reward, you get your very own `The Phantom of Web3` zombie! Level 3.0 (for Web 3.0 😉), complete with fox mask. Check him out to the right.

## Next Steps

This lesson was intentionally basic. We wanted to show you the core logic you would need in order to interact with your smart contract, but didn't want to take up too much time in order to do a full implementation since the Web3.js portion of the code is quite repetitive, and we wouldn't be introducing any new concepts by making this lesson any longer.

So we've left this implementation bare-bones. Here's a checklist of ideas for things we would want to implement in order to make our front-end a full implementation for our zombie game, if you want to run with this and build it on your own:

1. Implementing functions for `attack`, `changeName`, `changeDna`, and the ERC721 functions `transfer`, `ownerOf`, `balanceOf`, etc. The implementation of these functions would be identical to all the other `send` transactions we covered.

2. Implementing an "admin page" where you can execute `setKittyContractAddress`, `setLevelUpFee`, and `withdraw`. Again, there's no special logic on the front-end here — these implementations would be identical to the functions we've already covered. You would just have to make sure you called them from the same Ethereum address that deployed the contract, since they have the `onlyOwner` modifier.

3. There are a few different views in the app we would want to implement:

  a. An individual zombie page, where you can view info about a specific zombie with a permalink to it. This page would render the zombie's appearance, show its name, its owner (with a link to the user's profile page), its win/loss count, its battle history, etc.

  b. A user page, where you could view a user's zombie army with a permalink. You would be able to click on an individual zombie to view its page, and also click on a zombie to attack it if you're logged into MetaMask and have an army.

  c. A homepage, which is a variation of the user page that shows the current user's zombie army. (This is the page we started implementing in index.html).

4. Some method in the UI that allows the user to feed on CryptoKitties. We could have a button by each zombie on the homepage that says "Feed Me", then a text box that prompted the user to enter a kitty's ID (or a URL to that kitty, e.g. <a href="https://www.cryptokitties.co/kitty/578397" target=_blank>https://www.cryptokitties.co/kitty/578397</a>). This would then trigger our function `feedOnKitty`.

5. Some method in the UI for the user to attack another user's zombie.

  One way to implement this would be when the user was browsing another user's page, there could be a button that said "Attack This Zombie". When the user clicked it, it would pop up a modal that contains the current user's zombie army and prompt them "Which zombie would you like to attack with?"

  The user's homepage could also have a button by each of their zombies that said "Attack a Zombie". When they clicked it, it could pop up a modal with a search field where they could type in a zombie's ID to search for it. Or an option that said "Attack Random Zombie", which would search a random number for them.

  We would also want to grey out the user's zombies whose cooldown period had not yet passed, so the UI could indicate to the user that they can't yet attack with that zombie, and how long they will have to wait.

6. The user's homepage would also have options by each zombie to change name, change DNA, and level up (for a fee). Options would be greyed out if the user wasn't yet high enough level.

7. For new users, we should display a welcome message with a prompt to create the first zombie in their army, which calls `createPseudoRandomZombie()`.

8. We'd probably want to add an `Attack` event to our smart contract with the user's `address` as an `indexed` property, as discussed in the last chapter. This would allow us to build real-time notifications — we could show the user a popup alert when one of their zombies was attacked, so they could view the user/zombie who attacked them and retaliate.

9. We would probably also want to implement some sort of front-end caching layer so we aren't always slamming Infura with requests for the same data. (Our current implementation of `displayZombies` calls `getZombieDetails` for every single zombie every time we refresh the interface — but realistically we only need to call this for the new zombie that's been added to our army).

10. A real-time chat room so you could trash talk other players as you crush their zombie army? Yes plz.

That's just a start — I'm sure we could come up with even more features — and already it's a massive list.

Since there's a lot of front-end code that would go into creating a full interface like this (HTML, CSS, JavaScript and a framework like React or Vue.js), building out this entire front-end would probably be an entire course with 10 lessons in itself. So we'll leave the awesome implementation to you.

> Note: Even though our smart contract is decentralized, this front-end for interacting with our DApp would be totally centralized on our web-server somewhere.
>
> However, with the SDK we're building at <a href="https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880" target=_blank>Loom Network</a>, soon you'll be able to serve front-ends like this from their own DAppChain instead of a centralized web server. That way between Ethereum and the Loom DAppChain, your entire app would run 100% on the blockchain.

## Conclusion

This concludes Lesson 6. You now have all the skills you need to code a smart contract and a front-end that allows users to interact with it!

In the next lesson, we're going to be covering the final missing piece in this puzzle — deploying your smart contracts to Ethereum.

Go ahead and click "Next Chapter" to claim your rewards!
