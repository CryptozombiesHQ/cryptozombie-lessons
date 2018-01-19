---
title: 智能合约的不变性
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract KittyInterface {
          function getKitty(uint256 _id) external view returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
          );
        }

        contract ZombieFeeding is ZombieFactory {

          // 1. Remove this:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Change this to just a declaration:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Add setKittyContractAddress method here

          function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        contract ZombieFactory {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;

            struct Zombie {
                string name;
                uint dna;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external {
          kittyContract = KittyInterface(_address);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(species) == keccak256("kitty")) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

目前为止，我们所讲的 `Solidity` 和其他语言没有质的区别，它长得很像 `Javascript`. 但是，在 `Ethereum` 上的 `DApp` 与普通的应用有着天壤之别。

第一个例子，当你把智能合约部署到 `Ethereum` 之后，它就再也**_无法变更_**, 这种特性意味着你的代码永远不能被更新。

你的程序会永久的存储在区块链中，且无法更改。基于这一点，安全性是非常重要的事情。如果你的智能合约有任何`BUG`，那么你必须让用户使用修复后的新的智能合约。

但是这同时也是智能合约特殊之处，你的智能合约就是法律，没有人可以逍遥法外，这意味着你的代码在执行过程中不会出现意料之外的结果。

## 外部依赖

在第二课中，我们将 `CryptoKitties` 的合约地址写死了，但是如果有人将所有的 `kitty` 资源删除，会发生什么呢？

这不太可能，但如果这是真的，我们的`DApp`将无法使用 -- 我们的`DApp`会指向到我们写死的合约地址上，但它不会返回任何的 `kitty` 资源。我们的僵尸
将无法以`kitty`为食，我们也无法修改我们的合同来修复它。

为此，我们有必要更新创建一些新的函数来进行更新

例如，我们应该定义一个可供修改 `CryptoKitties`合约的 `setKittyContractAddress` 函数，而不是将该地址写死到我们的`DApp`中。

## 练习

让我们从第 2 课中更新我们的代码，以便能够更改 `CryptoKitties`合约的地址。

1. 删除我们写死的 `ckAddress` 这一行

2. 将 `kittyContract` 这一行代码更改为仅声明变量，不让它等于任何东西。

3. 创建一个名为 `setKittyContractAddress` 的函数，参数为`_address` (一个 `address`) 它应该是一个 `external` 函数。

4. 在这个函数中，添加一行代码将 `kittyContract` 设置为 `KittyInterface(_address)`。

> Note: 如果你注意到这里有一个安全漏洞，别担心--我们会在下一章修复它 ;)
