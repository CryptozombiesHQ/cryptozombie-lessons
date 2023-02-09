---
title: "Contracts"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: rust
    startingCode: |
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();
    answer: > 
      #![no_std]

      multiversx_sc::imports!();
      multiversx_sc::derive_imports!();

      #[multiversx_sc::contract]
      pub trait ZombiesContract {
        #[init]
        fn init(&self) {}
      }
---


Starting with the absolute basics:

Rust is a multiparadigm  programming language focused on type safety and performance, enabling users to build fast and robust applications. A `contract` is the fundamental building block of MultiversX applications — all variables and functions belong to a contract, and this will be the starting point of all your projects.

An empty contract named `HelloWorld` can be created with **mxpy** by running `mxpy contract new hello-world --template empty` from terminal and its structure would liik like this:

```
├── meta
├── scenarios
├── src
  ├── lib.rs
├── tests
├── wasm
. Cargo.toml
```
In here we are interested for now of **lib.rs** from inside the root folder **src**, and would look like this.

```
#[mx_sc::contract]
pub trait ZombiesContract {
        #[init]
        fn init(&self) {}
}
```

Here `#[multiversx_sc::contract]` is a procedural macro that defines the `ZombieFactory` trait as a contract. You will see a pattern of using procedural macros, since these are the ones that make the transition from a more user friendly code writing to a very complex and high performant contract build.

What every contract has as a mandatory function is a init, marked with `#[init]`. Here all the presets of the contract should be put.

## Basic syntagm

A rust contract typically starts with `#![no_std]` - a feature indicating that our application will link to the `core` crate rather than the `std`.

Rust's standard design library is split into a few layers, each building on the assumed platform capabilities of the one below. Knowing that there is:

- `sdt`: the full standard library that assumes the presence of threads, a filesystem, and networking. [...]

- `alloc`: the collections layer builds on the core by assuming runtime support for dynamic memory allocation.

- `core`: the core layer makes no (well, not very many) assumptions about the > underlying platform. Just about any target that can run Rust code is supported by core.

Now, the main idea is that the platform develped by **MultiversX** is avoiding the use of `alloc` since the dynamic memory allocation is faulty of increasing the size of the contract, also the reason of certain data types with unfixed size are replaced with something easier to manage. More of this in the next lessons, but for now we require just the simple adding of `#![no_std]`

The next step is importing the **MultiversX** Rust SDK, done by calling the macros `multiversx_sc::imports!();` and `multiversx_sc::derive_imports!();`

# Put it to the test

To start creating our Zombie army, let's create a base contract called `ZombieFactory`.

1. In the box to the right, create an empty contract called `ZombieFactory`.

When you're finished, click "check answer" below. If you get stuck, you can click "hint".
