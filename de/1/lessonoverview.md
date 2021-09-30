---
title: Lesson Overview
actions:
  - 'checkAnswer'
  - 'hints'
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---
In Lesson 1, you're going to build a "Zombie Factory" to build an army of zombies.

* Our factory will maintain a database of all zombies in our army
* Our factory will have a function for creating new zombies
* Each zombie will have a pseudo-random and unique appearance

In later lessons, we'll add more functionality, like giving zombies the ability to attack humans or other zombies! But before we get there, we have to add the basic functionality of creating new zombies.

## How Zombie DNA Works

The zombie's appearance will be based on its "Zombie DNA". Zombie DNA is simple — it's a 16-digit integer, like:

    8356281049284737
    

Just like real DNA, different parts of this number will map to different traits. The first 2 digits map to the zombie's head type, the second 2 digits to the zombie's eyes, etc.

> Note: For this tutorial, we've kept things simple, and our zombies can have only 7 different types of heads (even though 2 digits allow 100 possible options). Later on we could add more head types if we wanted to increase the number of zombie variations.

For example, the first 2 digits of our example DNA above are `83`. To map that to the zombie's head type, we do `83 % 7 + 1` = 7. So this Zombie would have the 7th zombie head type.

In the panel to the right, go ahead and move the `head gene` slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to.

# Put it to the test

1. Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different aspects of the zombie's appearance.

Ok, enough playing around. When you're ready to continue, hit "Next Chapter" below, and let's dive into learning Solidity!
