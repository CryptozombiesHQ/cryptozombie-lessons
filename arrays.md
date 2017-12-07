---
title: Arrays
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 8;
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

        uint dnaDigits = 8;
        uint dnaModulus = 10 ** dnaDigits;

        struct Zombie {
          uint dna;
          string name;
        }

        Zombie[] public zombies;

      }
---

We're going to introduce 2 concepts in this lesson: **Arrays** and **Visibility**.

## Arrays

There are two types of arrays in Solidity: **_fixed_** arrays and **_dynamic_** arrays:

```
// Declaring arrays:
uint[2] fixedArray; // has a fixed length of 2 elements
uint[] dynamicArray; // has a variable length

// Interacting with fixed-length arrays:
fixedArray[0] = 2;
fixedArray[1] = 3; // fixedArray is now [2, 3]
fixedArray[2] = 4; // throws an error, since array is fixed
fixedArray.length; // equal to 2
fixedArray[1]; // equal to 3

// Interacting with dynamic arrays:
dynamicArray[0] = 2; // this will fail...
dynamicArray.length; // ...because this is equal to 0
dynamicArray.length = 3; // this is legal with dynamic arrays
dynamicArray[0] = 2; // this works now!
dynamicArray.push(3); // this also works
// dynamicArray now equal to [2, 3]
dynamicArray.length; // now equal to 2
```

You can also create an array of **_structs_**. From the previous chapter's examples:

```
Person[] people; // dynamic array
people.push({name: "Satoshi", age: 172});
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
