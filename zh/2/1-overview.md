---
title: Lesson 2 Overview
actions: ['checkAnswer', 'hints']
material:
  saveZombie: false
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: true
    ignoreZombieCache: true
    answer: 1
---

在第一课中，我们创建了一个命名的函数用来生成僵尸 ，并且将它放置在我们区块链的僵尸数据库中。
在第二课里，我们会让我们的app更加像一个游戏： 让它支持多用户，并且采用更加有趣--而不仅仅随机--的方式，来生成僵尸，

我们如何生成新的僵尸呢？通过让僵尸“喂食”其他生物！

## 僵尸喂食

僵尸喂食的时候， 它会用病毒侵入宿主， 这些病毒会将宿主变为新的僵尸，加入你的军团。系统会通过宿主和侵入僵尸的DNA计算出新僵尸的DNA。

僵尸最喜欢喂食什么样的物种呢？
等你学完第二课就知道了！

# 小测试

右边是一个简单的喂食展示。点击一个“人”，试试看僵尸喂食的时候会发生什么?
可见，新僵尸的DNA是通过从原来的僵尸的DNA, 加上宿主的DNA计算得来的。

学完这一章，请点击“下一章”， 我们让游戏支持多玩家模式。