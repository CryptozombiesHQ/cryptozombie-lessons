---
title: Withdraws
actions:
  - 'checkAnswer'
  - 'hints'
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
        
        // 1. Create withdraw function here
        
        // 2. Create setLevelUpFee function here
        
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
        
        function _generatePseudoRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
        }
        
        function createPseudoRandomZombie(string _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generatePseudoRandomDna(_name);
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
      modifier aboveLevel(uint _level, uint _zombieId) { require(zombies[_zombieId].level >= _level); _; }
      function withdraw() external onlyOwner { owner.transfer(this.balance); }
      function setLevelUpFee(uint _fee) external onlyOwner { levelUpFee = _fee; }
      function levelUp(uint _zombieId) external payable { require(msg.value == levelUpFee); zombies[_zombieId].level++; }
      function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].name = _newName; }
      function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) { require(msg.sender == zombieToOwner[_zombieId]); zombies[_zombieId].dna = _newDna; }
      function getZombiesByOwner(address _owner) external view returns(uint[]) { uint[] memory result = new uint[](ownerZombieCount[_owner]); uint counter = 0; for (uint i = 0; i < zombies.length; i++) { if (zombieToOwner[i] == _owner) { result[counter] = i; counter++; } } return result; }
      }
---
In the previous chapter, we learned how to send Ether to a contract. So what happens after you send it?

After you send Ether to a contract, it gets stored in the contract's Ethereum account, and it will be trapped there — unless you add a function to withdraw the Ether from the contract.

You can write a function to withdraw Ether from the contract as follows:

    contract GetPaid is Ownable {
      function withdraw() external onlyOwner {
        owner.transfer(this.balance);
      }
    }
    

Note that we're using `owner` and `onlyOwner` from the `Ownable` contract, assuming that was imported.

You can transfer Ether to an address using the `transfer` function, and `this.balance` will return the total balance stored on the contract. So if 100 users had paid 1 Ether to our contract, `this.balance` would equal 100 Ether.

You can use `transfer` to send funds to any Ethereum address. For example, you could have a function that transfers Ether back to the `msg.sender` if they overpaid for an item:

    uint itemFee = 0.001 ether;
    msg.sender.transfer(msg.value - itemFee);
    

Or in a contract with a buyer and a seller, you could save the seller's address in storage, then when someone purchases his item, transfer him the fee paid by the buyer: `seller.transfer(msg.value)`.

These are some examples of what makes Ethereum programming really cool — you can have decentralized marketplaces like this that aren't controlled by anyone.

## Putting it to the Test

1. Create a `withdraw` function in our contract, which should be identical to the `GetPaid` example above.

2. The price of Ether has gone up over 10x in the past year. So while 0.001 ether is about $1 at the time of this writing, if it goes up 10x again, 0.001 ETH will be $10 and our game will be a lot more expensive.
    
    So it's a good idea to create a function that allows us as the owner of the contract to set the `levelUpFee`.
    
    a. Create a function called `setLevelUpFee` that takes one argument, `uint _fee`, is `external`, and uses the modifier `onlyOwner`.
    
    b. The function should set `levelUpFee` equal to `_fee`.
