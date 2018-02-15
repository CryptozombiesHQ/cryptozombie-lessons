---
title: battle arena
actions: ['答え合わせ', 'ヒント']
material:
  saveZombie: false
  battleArena:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---

レッスン１で作った関数は、受け取った名前からランダムなゾンビを生成し、そいつをブロックチェーン上にある我らがアプリのゾンビ・データベースに追加するんだったな。

レッスン２では、このアプリをもっとゲームっぽくしていこう。複数プレイヤーにして、ゾンビの生成も、単にランダムに行うよりも楽しい方法にするからな。

どうやって新たなゾンビを生成するのか？我々のHow will we create new zombies? By having our zombies "feed" on other lifeforms!

## Zombie Feeding

When a zombie feeds, it infects the host with a virus. The virus then turns the host into a new zombie that joins your army. The new zombie's DNA will be calculated from the previous zombie's DNA and the host's DNA.

And what do our zombies like to feed on most?

To find that out... You'll have to complete lesson 2!

# Put it to the test

There's a simple demo of feeding to the right. Click on a human to see what happens when your zombie feeds!

You can see that the new zombie's DNA is determined by your original zombie's DNA, as well as the host's DNA.

When you're ready, click "Next chapter" to move on, and let's get started by making our game multi-player.
