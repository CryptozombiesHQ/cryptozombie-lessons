---
title: Payable
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

          // 1. Tu definuj funkciu levelUpFee 

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Tu vlož funkciu levelUp

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
Doposiaľ sme hovorili o niekoľkých **_funkčných modifikátoroch_** Môže byť ťažké si to všetko zapamätať, poďme si to teda ešte rýchlo zopakovať.
Up until now, we've covered quite a few **_function modifiers_**. It can be difficult to try to remember everything, so let's run through a quick review:

1. K dispozicií mamé modifikátory viditelnosti, ktore určujú odkiaľ môže byť daná funkcia zavolaná. `private` znamená, že môže byť volaná len z ostatných funkcií rovnkého kontraktu. `internal` je ako `private`, ale môže byť volaná taktiež z kódu oddedených kontraktov. `external` funkcie môžu byť volané iba externe, mimo daného kontraktu. Na záver, `public` môžu byť volané odkiaľkoľvek - môžu byť volané interne aj externe. 
1. We have visibility modifiers that control when and where the function can be called from: `private` means it's only callable from other functions inside the contract; `internal` is like `private` but can also be called by contracts that inherit from this one; `external` can only be called outside the contract; and finally `public` can be called anywhere, both internally and externally.

2. Ďalej máme taktiež modifikátoy stavu, ktoré deklarujú akým spôsobom funkcia interaguje s blockchain: `view` hovorí, že tým že spustíme funkciu, žiadne dáta na blockchain nebudu modifikované. `pure` zase značí že funkcia nezapisuje ani nečíta žiadne data z blockchain. Volanie oboch týchto typov funkcii je zadarmo z hľadiska gasu, v prípade že sú tieto funkcie volané externe mimo kontraktu (no budú stáť gas, v prípade že su zavolané interne inou funkciou kontraktu).
2. We also have state modifiers, which tell us how the function interacts with the BlockChain: `view` tells us that by running the function, no data will be saved/changed. `pure` tells us that not only does the function not save any data to the blockchain, but it also doesn't read any data from the blockchain. Both of these don't cost any gas to call if they're called externally from outside the contract (but they do cost gas if called internally by another function).

3. Na záver mame vlastné modifikátor `modifiers`, o ktorých sme sa naučili v Lekcii 3: `onlyOwner` and `aboveLevel`, napríklad. Pre tieto môžeme napísať vlastnú logiku a definovať ako ovplyvnia funkciu.
3. Then we have custom `modifiers`, which we learned about in Lesson 3: `onlyOwner` and `aboveLevel`, for example. For these we can define custom logic to determine how they affect a function.

Všetky tieto tpyp modifikátorov môžu byť použité spolu, napríklad takto:
These modifiers can all be stacked together on a function definition as follows:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

V tejto kapitelo sa pozrieme na ďalší modifikátor: `payable`.
In this chapter, we're going to introduce one more function modifier: `payable`.

## Modifikátor `payable`
## The `payable` Modifier

Funkcie ktoré su `payable` je to čo robí Solidity a Ethereum tak cool - sú to špeciálne typy funkcii, ktoré su schopné príjmať Ether.
`payable` functions are part of what makes Solidity and Ethereum so cool — they are a special type of function that can receive Ether. 

Poďme o tom chvíľu premýšlať. Keď zavoláš API normálneho, nemôžeš mu poslať americké doláre alebo bitcoin spolu s tvojim HTTP requestom.
Let that sink in for a minute. When you call an API function on a normal web server, you can't send US dollars along with your function call — nor can you send Bitcoin.

Ale na Ethereum blockchain, pretože peniaze (_Ether_), dáta (*dáta transkacie*)/(*transaction payload*) aj kód kontraktu ležia všetky na Ethereum blockchain, je môžné naraz zavolať funkciu kontraktu **a zároveň** poslať kontraktu peniaze.
But in Ethereum, because both the money (_Ether_), the data (*transaction payload*), and the contract code itself all live on Ethereum, it's possible for you to call a function **and** pay money to the contract at the same time.

To umožnuje vytvárať zaujímavú logiku, napríklad vyžadovanie určitej platby, na to aby kontrakt vykonal zavolanú funkciu.
This allows for some really interesting logic, like requiring a certain payment to the contract in order to execute a function.

## Poďme sa pozrieť na príklad
## Let's look at an example
```
contract OnlineStore {
  function buySomething() external payable {
    // skontroluj že 0.001 etheru bolo poslaného naraz s funkčným volaním
    require(msg.value == 0.001 ether);
    // Ak áno, potom môžme volatelovi funkcie privlastniť nejaký digitálny majetok, napríklad zombieho:
    transferThing(msg.sender);
  }
}
```

V tomto príklade nám `msg.value` ukazuje koľko Etheru bolo poslaného kontraktu. `ether` je vstaná jednotka. 
Here, `msg.value` is a way to see how much Ether was sent to the contract, and `ether` is a built-in unit.

Na nasledujúcom príklade je ukážka ako by niekto mohol zavolať túto funkciu z web3.js (z Javascriptového front endu našej DAppky):
What happens here is that someone would call the function from web3.js (from the DApp's JavaScript front-end) as follows:

```
// Predpoklajme že `OnlineStore` referuje na náš kontrakt na Ethereum blockchain
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Všimni si parameter `value`, ktorým javascriptové funkčné volanie špecifikuje koľko `ether`u poslať (0.001). Ak si predstavíme transakciu ako odoslanie obálky, funkčné parametre sú ako písmenká ktoré napíšeš na list v obálke a `value` je ako keď do tej obálky ešte pridáš bankovky. List aj peniaze v obálky su potom doručené príjemcovi ako transakcia.
Notice the `value` field, where the javascript function call specifies how much `ether` to send (0.001). If you think of the transaction like an envelope, and the parameters you send to the function call are the contents of the letter you put inside, then adding a `value` is like putting cash inside the envelope — the letter and the money get delivered together to the recipient.

>Poznámka: Ak funkcia nie je označená `payable` a pri jej zavolaní sa pokúsiš poslať nejaký Ether, tvoja transakcia bude odmietnutá.
>Note: If a function is not marked `payable` and you try to send Ether to it as above, the function will reject your transaction.

## Vyskúšaj si to sám
## Putting it to the Test

Poďme v našej zombie hre vytvoriť `payable` funkciu.
Let's create a `payable` function in our zombie game.

Dajme tomu že naša hra bude mať takú vlasnosť, že užívatelia môžu zaplatiť ETH na to, aby zvýšili level svojich zombie. ETH ktorý ľudia kontraktu pošlú zostane uložený v tvojom kontrakte ktorého si vlastník - toto je jednoduchý príklad ako môžeš zarobiť peniaze na svojich hrách. 
Let's say our game has a feature where users can pay ETH to level up their zombies. The ETH will get stored in the contract, which you own — this a simple example of how you could make money on your games!

1. Definuj premennú kontraktu `uint` s názvom `levelUpFee` a nastav ju na hodnotu `0.001 ether`.
1. Define a `uint` named `levelUpFee`, and set it equal to `0.001 ether`.

2. Vytvori funkciu s názvom `levelUp`. Tá bude príjmať jeden parameter `_zombieId` typu `uint`. Bude to funkcia `external` a `payable`.
2. Create a function named `levelUp`. It will take one parameter, `_zombieId`, a `uint`. It should be `external` and `payable`.

3. Funkcia by mala najprv použiť `require` aby skontrolovala že `msg.value` sa rovná `levelUpFee`.
3. The function should first `require` that `msg.value` is equal to `levelUpFee`.

4. Ďalej by mala inkrementovať `level` daného zombie: `zombies[_zombieId].level++`.
4. It should then increment this zombie's `level`: `zombies[_zombieId].level++`.
