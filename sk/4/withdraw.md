---
title: Výber Etheru
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          uint levelUpFee = 0.001 ether;

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 1. Tu napíš funkciu withdraw

          // 2. Tu napíš funkciu setLevelUpFee

          function levelUp(uint _zombieId) external payable {
            require(msg.value == levelUpFee);
            zombies[_zombieId].level++;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            uint counter = 0;
            for (uint i = 0; i < zombies.length; i++) {
              if (zombieToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
              }
            }
            return result;
          }

        }
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

          KittyInterface kittyContract;

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            feedAndMultiply(_zombieId, kittyDna, "kitty");
          }
        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
          }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function withdraw() external onlyOwner {
          owner.transfer(this.balance);
        }

        function setLevelUpFee(uint _fee) external onlyOwner {
          levelUpFee = _fee;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

V predošlej kapitole sme sa naučili ako posielať kontraktu Ether. Čo sa však stane keď ho tam pošleš?
In the previous chapter, we learned how to send Ether to a contract. So what happens after you send it?

Po tom čo odošleš kontraktu Ether, bude prijatý Ether uložený na Ethereum účte tvojho kontraktu. Pokiaľ nepridáme funkciu na jeho výber, zostane tam Ether uviaznutý.
After you send Ether to a contract, it gets stored in the contract's Ethereum account, and it will be trapped there — unless you add a function to withdraw the Ether from the contract. 

Funkciu na výber Etheru môžme napísať takto:
You can write a function to withdraw Ether from the contract as follows:

```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```

Všímni si že používame `owner` a `onlyOwner`  z `Ownable` kontraktu, za predpokladu že bol naimportovaný. 
Note that we're using `owner` and `onlyOwner` from the `Ownable` contract, assuming that was imported.

Ether môžeš odoslať na inú adresu pomocou funkcie `transfer` a `this.balance` ti zase povie, koľko Etheru je momentálne uloženého na adrese kontraktu. Takže ak napríklad 100 užívateľov pošle našemu kontraktu 1 Ether, `this.balance` sa bude rovnať 100 Ether.
You can transfer Ether to an address using the `transfer` function, and `this.balance` will return the total balance stored on the contract. So if 100 users had paid 1 Ether to our contract, `this.balance` would equal 100 Ether.

Funkciu `transfer` môžeš používať na to, aby si nejaký Ether z kontraktu previedol na iný účet. Môžeš mať napríklad funkciu ktorá prevedie akýkoľvek Ether, ktorý obdržala v transakcii naviac, naspať odosielateľovi transakcie. 
You can use `transfer` to send funds to any Ethereum address. For example, you could have a function that transfers Ether back to the `msg.sender` if they overpaid for an item:

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

Prípadne v kontrakte s kupcom a predávajúcim by si si mohol do kontraktu uložiť adresu predajcu, a až by sa niekto rozhodol kúpiť predmet ktorý predáva, preposlal by si mu poplatok za predmet od kupcu takto: `seller.transfer(msg.value)`. 
Or in a contract with a buyer and a seller, you could save the seller's address in storage, then when someone purchases his item, transfer him the fee paid by the buyer: `seller.transfer(msg.value)`.

Toto bolo pár príkladov, čo robí programovanie na Ethereum fakt cool - môžeme vytvárať decentralizované trhy, ktoré nie su nikým centrálne riadené.
These are some examples of what makes Ethereum programming really cool — you can have decentralized marketplaces like this that aren't controlled by anyone.

## Vyskúšaj si to sám
## Putting it to the Test

1. Vytvor v našom kontrakte funkciu `withdraw`, ktorá by mala byť identická so spomínaým príkladom funkcie `GetPaid` vyššie.
1. Create a `withdraw` function in our contract, which should be identical to the `GetPaid` example above.

2. Cena Etheru sa za posledný krat znásobila 10x. Takže zatiaľ čo  0.001 etheru je teraz ekvivalent asi 1 doláru v čase písania tohot tutoriálu, ak sa cena opäť zvýši 10x, 0.001 ETH sa už bude rovnať 10 dolárom. Naša hra by sa tak naraz stala oveľa drahšia na hranie.
2. The price of Ether has gone up over 10x in the past year. So while 0.001 ether is about $1 at the time of this writing, if it goes up 10x again, 0.001 ETH will be $10 and our game will be a lot more expensive.

  Preto je dobrý nápad si vytvoriť funkciu, ktorá umožní vlastníkovi kontraktu nastaviť hodnotu `levelUpFee`.
  So it's a good idea to create a function that allows us as the owner of the contract to set the `levelUpFee`.

  a. Vytvor funkciu s naźvom `setLevelUpFee`. Bude príjmať argument `uint _fee`. Funkcia bude `external` a naviac bude používať modifikátor `onlyOwner`.
  a. Create a function called `setLevelUpFee` that takes one argument, `uint _fee`, is `external`, and uses the modifier `onlyOwner`.

  b. Funkcia by mala nastaviť `levelUpFee` rovný `_fee`.
  b. The function should set `levelUpFee` equal to `_fee`.
