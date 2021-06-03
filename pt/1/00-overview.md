---
title: How to Build an Oracle
header: How to Build an Oracle
path: solidity_advanced
publishedOn: Cryptozombies
---

By completing the previous tutorials you've demonstrated a good grasp of Solidity and JavaScript; and you are probably well on your way to building your first dapp. If so, you may already have noticed that smart contracts can't directly access data from the outside world through an HTTP request or something similar. Instead, smart contracts pull data through something called an **_oracle_**.

This lesson is the first in the sequence of three lessons that aim to show how you can **_build and interact with an oracle_**.

In the first two lessons, we will be teaching you to build and interact with the simplest possible oracle that allows only one user, its owner, to fetch data from Binance's public API.

That said, I have a question for you: why would users trust your oracle?🤔🤔🤔

The quick answer is that they wouldn't. At least not until there **_social trust_** or you come up with a **_decentralized version_**. Thus, in the third lesson, we'll show you how to make your oracle more decentralized. But, for now, let's start with the beginning.

Time to write some code!
