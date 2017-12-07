---
title: Math Operations
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 8;
        //start here

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 8;
        uint dnaModulus = 10 ** DNA_DIGITS;

      }

---

Math in Solidity is pretty straightforward. The following operations are the same as in most programming languages:

* Addition: `x + y` 
* Subtraction: `x - y`, 
* Multiplication: `x * y` 
* Division: `x / y`
* Modulus / remainder: `x % y`

Solidity also supports an **_exponential operator_**:

```
uint x = 5 ** 2 // equal to 5^2 = 25
```

# Put it to the test

To make sure our Zombie's DNA is only 8 characters, we'll need a 
