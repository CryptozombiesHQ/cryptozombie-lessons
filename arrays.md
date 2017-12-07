---
title: Arrays
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

        // start here

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 10;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

        Zombie[] public zombies;

      }
---

When you want a collection of something, you can use an **_array_**.

There are two types of arrays in Solidity: **_fixed_** arrays and **_dynamic_** arrays. With **_fixed_** arrays, you declare a maximum number of elements when you declare them, and this can't be changed. With **_dynamic_** arrays, you can keep growing the array to accommodate more elements.

## Declaring Arrays

In Solidity, arrays are declared as follows:

```
uint[2] fixedArray; // has a fixed length of 2 elements
string[5] stringArray; // fixed array, can contain 5 strings
uint[] dynamicArray; // has no fixed size, can keep growing
```

You can also create an array of **_structs_**. From the previous chapter's example:

```
Person[] people; // dynamic array
```

Since we said state variables are stored in the blockchain when they're updated, creating a dynamic array of structs like this can be used as a kind of database for your contract.

## Public Arrays

You can declare an array as `public`, and Solidity will automatically create a **_getter_** method for it. The syntax looks like:

```
Person[] public people;
```

Other contracts would then be able to read (but not write) to this array. So this is a useful pattern for storing public data in your contract.

# Put it to the test

We're going to want to store an army of zombies in our app. And we're going to want to show off all our zombies to other apps, so we'll want it to be public.

Create a public array of `Zombie` **_structs_**.
