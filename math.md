---
title: Math Operations
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 16;
        //start here

      }
    answer: >
      pragma solidity ^0.4.19;

      contract ZombieFactory {

        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;

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
uint x = 5 ** 2; // equal to 5^2 = 25
```

# Put it to the test

To make sure our Zombie's DNA is only 8 characters, let's make another `uint` equal to 10^8. That way we can later use the modulus operator `%` to shorten an integer to 8 digits.

1. Create a `uint` named `dnaModulus`, and set it equal to **10 to the power of `dnaDigits`**.
