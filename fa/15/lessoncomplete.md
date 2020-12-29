---
title: Lesson Complete!
actions: ['checkAnswer', 'hints']
material:
  lessonComplete: 1
---

Awesome, you've completed Lesson 2 of our series about building and interacting with an oracle.

Because we're just building an oracle for demo purposes, we've made a bunch of decisions that simplified things a bit. For example, think about what would happen when you bring the oracle down for an upgrade. Yeah, even if it'll take just a few minutes until you bring it back online, all the requests made during this period will be lost. And there's no way to notify the app that a particular request hasn't been processed. A solution for this is to keep track of the last block that got processed, and, every time the oracle starts, it should take it from there.

A production-ready oracle should take care of this, and a few other things, of which, the most important is: how to make the oracle more **_decentralized_**. And this is exactly what we'll cover next.

Stay tuned for our next lesson!
