---
title: Lesson Overview
actions: ['checkAnswer', 'hints']
requireLogin: true
material: 
  zombiePartsBin:
    answer: 1
---

In Lesson 1, you're going to build a "Zombie Factory". Our factory will produce an army of zombies that each have a different appearance.

To do this, we're going to make a function that randomly generates "Zombie DNA". Zombie DNA will be a 16-digit integer like:

```
8356281049284737
```

Just like real DNA, different parts of this number will map to different traits. For our zombies, every 2 digits of this number will affect one aspect of the zombie's appearance. You can see the 6 traits we've chosen on the right side of the page.

For example, our zombies can have 7 different types of heads. So if we take the first 2 digits `83`, that would map to `83 % 7 + 1` = the 7th zombie head.

You can move the slider to the 7th head (the Santa hat) to see what trait the `83` would correspond to.

# Put it to the test

Play with the sliders on the right side of the page. Experiment to see how the different numerical values correspond to different zombie appearances.

Ready to get started?

Hit "Next Chapter" below, and let's dive into coding!
