---
title: Making the Zombie Factory
header: Welcome, human!
roadmap: roadmap.jpg
path: multiversx
publishedOn: Cryptozombies
---

Welcome, CryptoZombie!

In this tutorial, you'll learn how to deploy a smart contract to MultiversX, a sharded smart contract execution platform with a PoS consensus mechanism. Wondering why MultiversX is worth exploring? Let's go through its advantages over other blockchains and VMs:

 - Performance: With a current throughput of 15,000 TPS, 6s block time, and $0.001 transaction cost, MultiversX significantly outperforms many other blockchains. In testnet, it even reached 263,000 TPS! Its Adaptive State Sharding architecture allows it to scale beyond 100,000 TPS as the network grows.

 - Developer-friendly: For a smooth coding experience, developers have the MultiversX IDE at their disposal, as well as a Rust framework with a debugger, and royalties with 30% of the gas paid for the smart contract execution returned to authors. This creates a seamless development experience and incentivizes high-quality smart contract creation.

 - MultiversX WASM VM: This fast and secure virtual machine executes smart contracts written in any programming language that can compile to WebAssembly, allowing for broader language support and greater flexibility.

 - High-performant and ultra-safe Rust framework: Rust is known to be a low-level multi-paradigm programming language featuring the same architecture as a computer processor, the reason why it is designed for scripting high-performance and machine-efficient code. The MultiversX framework provides super easy ways to design advanced, relatively low-sized smart contracts while at the same time, keeping the gas costs low.  

MultiversX's innovative Adaptive State Sharding and Secure Proof of Stake consensus mechanism make it a great platform for deploying your CryptoZombies smart contract. By offering scalability, high performance, and developer-friendly tools, MultiversX can provide the ideal environment for your smart contract deployment.

Now that you're familiar with the exciting possibilities of MultiversX, let's get started with deploying your CryptoZombies smart contract on this groundbreaking platform!



## Installing sc-meta

At MultiversX we developed a universal smart contract management tool called `multiversx-sc-meta` (or `sc-meta` as we will later interact with it). 

It is called that, because it provides a layer of meta-programming over the regular smart contract development. It can read and interact with some of the code written by developers.

- **3.8** or later on Linux and MacOS

In order to install it, simply call 

```
cargo install multiversx-sc-meta --locked
```

For further information please make sure to check https://docs.multiversx.com/developers/meta/sc-meta/
