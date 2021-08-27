---
title: View 関数でガスを節約
actions: ['答え合わせ', 'ヒント']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          // ここに関数を作成せよ

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

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
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

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
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

        }

      }
---

素晴らしい！これでレベルアップのインセンティブにするための特殊能力を設定することができたぞ。インセンティブは後でもっと追加していくぞ。

ここでもう一つ関数を追加するのだ：手持ちのゾンビ軍団を全て表示できるメソッドだ。名前は`getZombiesByOwner`としよう。

この関数はブロックチェーンからデータを読み取るだけで良いから、`view` 関数とすることができる。これはガスのコストに関連するから、少しその話をしてやろう：

## View 関数はガスコストが不要。

`view`関数を外部から呼び出す場合、ガスは一切かからない。

なぜかというと、`view` 関数がブロックチェーン上でなにも変更しないからだ。ただデータを参照するだけだからな。詳しくいうと、関数に`view`とマークすることで、その関数を実行するにはローカルのイーサリアムノードに問い合わせるだけでよく、ブロックチェーン上にトランザクションを生成する必要がないことを`web3.js`に伝えられるためだ（トランザクションを生成すると全てのノードで実行する必要があり、ガスが必要になる）

web3.jsをお主自身のノードで設定する方法は後で教えてやろう。今の所は、可能な場合は読み取り専用の`external view`関数を使うことで、DAppのガス使用量を最適にすることが出来ると覚えておくのだ。

> 注：`view`関数が同じコントラクトの、`view`関数**ではない**別の関数から呼び出される場合、その呼び出しにガスのコストがかかります。その別の関数はイーサリアム上にトランザクションを生成するので、各ノードの検証が必要になるためです。`view`関数は外部から呼び出す時のみ、無料になります。

## それではテストだ

手持ちのゾンビ軍団すべてを返す関数を実装したい。あとで、この関数を`web3.js`から呼んで、ユーザープロフィールページ上にゾンビ軍団を表示できるようにするためだ。

この関数のロジックは少々複雑だから、いくつかのチャプターに分けて教えてやるから順番に消化するのだ。

1. `getZombiesByOwner`という名前の関数を作成せよ。引数は`_owner`という名前の`address`型とする。

2. これを`external view`関数とし、ガスコストを使わずに`web3.js` から呼び出せるようにするのだ。

3. 関数は`uint[]` (`uint`の配列)を返すように設定すること。

関数本体は空で良い。次のチャプターで書き方は教えていくぞ。
