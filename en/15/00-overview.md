---
title: How to Build an Oracle
header: How to Build an Oracle
path: solidity_advanced
publishedOn: Cryptozombies
---

By completing the previous tutorials you've demonstrated a good grasp of Solidity and JavaScript; and you are probably well on your way to building your first dapp. We previously learnt how to work with Chainlink oracles, a modular framework for building and working with decentralized data and computation from outside the blockchain.

This lesson is the first in the sequence of three lessons that aim to show how you can **_build and interact with an oracle_**. It's important to know the ramifications of doing something like this on your own, including upkeep, decentrality, data quality and everything else!

In the first two lessons, we will be teaching you to build and interact with the simplest possible oracle that allows only one user, its owner, to fetch data from Binance's public API.

That said, I have a question for you: why would users trust your oracle?🤔🤔🤔

The quick answer is that they wouldn't. At least not until there **_social trust_** or you come up with a **_decentralized version_**. Thus, in the third lesson, we'll show you how to make your oracle more decentralized. But, for now, let's start with the beginning.

We will be working with Truffle here, you can also make use of everything we will learn here out of the box with the [Chainlink Truffle Starter Kits](https://github.com/smartcontractkit/truffle-starter-kit).

Time to write some code!
