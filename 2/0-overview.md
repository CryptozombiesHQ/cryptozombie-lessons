---
title: Lesson 2 Overview
actions: ['checkAnswer', 'hints']
material:
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

In lesson 1, we created a function that takes a name, uses it to generate a random zombie, and adds that zombie to storage in our app.

However, a game where all you do is create new zombies by typing in names would get old pretty fast.

Additionally, right now our app only allows for 1 player — all zombies are stored in the same array, and we're currently not keeping track of a zombie's owner.

In lesson 2, we're going to expand upon what we built in lesson 1 by adding the following features to our app:

1. Assigning ownership of zombies to players

2. Making it so the function `createRandomZombie` can only be called one time. New players will call this function when they first start the game by entering their name to create their starting zombie.

3. Adding functionality to create new zombies in your army through "feeding". When a zombie feeds, it infects the host with a virus. The virus then turns the host into a new zombie that joins your army!

The new zombie's DNA will be determined by the Zombie you choose to feed, as well as the host it feeds on.

And what do our zombies prefer to feed on?

To find that out... You'll have to complete lesson 2!

# Put it to the test

Click on the human in the pane to the right to see what happens when your zombie feeds!

When you're ready, click "Next chapter" to move on.
