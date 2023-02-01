---
title: Making the Zombie Factory
header: Welcome, human!
roadmap: roadmap.jpg
path: rust
publishedOn: Cryptozombies
---

So you think you have what it takes to become a **CryptoZombie**, huh?

This course will teach you how to **build a game on MultiversX**.

It's designed for beginners to Rust.


## Installing mxpy

Before starting it is recommended to install our tool **mxpy** and please make sure you have a working **Python 3** environment:

- **3.8** or later on Linux and MacOS

Smart contracts written in C require the ncurses library routines for compiling. Install them using the following:

For Linux:
```
sudo apt install libncurses5
```
For MacOS:
```
brew install ncurses
```

In order to install **mxpy** using the `mxpy-up` installation script, run the following commands in a terminal:

```
wget -O mxpy-up.py https://raw.githubusercontent.com/multiversx/mx-sdk-py-cli/main/mxpy-up.py
python3 mxpy-up.py
```

This will create a light Python virtual environment (based on `venv`) in `~/multiversx-sdk/mxpy-venv `and also include `~/multiversx-sdk`in your **`$PATH`** variable (by editing the appropriate `.profile` file).

For forther information please make sure to check https://docs.multiversx.com/sdk-and-tools/sdk-py/installing-mxpy/

