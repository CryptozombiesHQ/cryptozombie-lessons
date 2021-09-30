---
title: Lesson 2 Overview
actions:
  - 'checkAnswer'
  - 'hints'
material:
  saveZombie: false
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---
In lesson 1, we created a function that takes a name, uses it to generate a pseudo-random zombie, and adds that zombie to our app's zombie database on the blockchain.

In lesson 2, we're going to make our app more game-like: We're going to make it multi-player, and we'll also be adding a more fun way to create zombies instead of just generating them randomly.

How will we create new zombies? By having our zombies "feed" on other lifeforms!

## Zombie Feeding

When a zombie feeds, it infects the host with a virus. The virus then turns the host into a new zombie that joins your army. The new zombie's DNA will be calculated from the previous zombie's DNA and the host's DNA.

And what do our zombies like to feed on most?

To find that out... You'll have to complete lesson 2!

# Put it to the test

There's a simple demo of feeding to the right. Click on a human to see what happens when your zombie feeds!

You can see that the new zombie's DNA is determined by your original zombie's DNA, as well as the host's DNA.

When you're ready, click "Next chapter" to move on, and let's get started by making our game multi-player.
