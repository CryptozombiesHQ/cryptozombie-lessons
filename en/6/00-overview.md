---
title: Chainlink, Oracles, External Computation & Data
header: "Lesson 6: Chainlink: The Decentralized Blockchain Oracle"
roadmap: xxx
path: solidity
publishedOn: Cryptozombies
---

You just keep getting more impressive by the second, but how will you fare when we look to combine the **real-world** and all of its changes and information with our beloved zombies?

In this lesson, we are going to go over **Chainlink** and **oracles**. 

<a href="https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72" target=_new>Blockchain Oracles</a> are devices that connect our smart contracts and zombies with data and computation from the real world, such as <a href="https://data.chain.link/" target=_new>pricing data on currencies</a>, <a href="https://docs.chain.link/docs/get-a-random-number/" target=_new>random number generators</a>, and  <a href="https://docs.chain.link/docs/make-a-http-get-request/" target=_new>any other data we can think of</a>. Blockchains can't interact with the outside world, as they are intentionally isolated and deterministic by nature.

So all we have to do, is trust one of these devices to honestly deliver our data and we are all set right?

The quick answer is no. At least not until there **_social trust_** or you come up with a **_decentralized version_**. You're doing all this work to build your smart contracts in a decentralized context, you'd basically ruin all the effort by pulling your data from a centralized version, even if you deliver the data yourself! 

When smart contract include data or computation from oracles they are considered [hybrid smart contracts](https://blog.chain.link/hybrid-smart-contracts-explained/), and many of the most successful decentralized applications include data from the external world. 

Are you ready to dive in? Let's learn!
