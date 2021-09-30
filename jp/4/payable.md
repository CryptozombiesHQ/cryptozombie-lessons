---
title: Payable関数
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

          // 1. ここにlevelUpFeeを定義するのだ

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. levelUp関数をここに入力せよ

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

これまで我々は **_関数修飾子_** をかなりたくさん扱ってきた。だが全部覚えるのは難しいかもしれないから、素早く復習していくぞ。

1. いつどこで関数を呼び出すかをコントロールする可視性修飾子というものがある。`private`修飾子はコントラクト内の別の関数からのみ呼び出されるという意味だ。`internal`修飾子は`private`修飾子に似ているが、そのコントラクトを継承したコントラクトからも呼び出す事ができる。`external`修飾子はコントラクト外からだけ呼び出す事ができて、最後に`public`修飾子だが、これはコントラクト内部・外部どちらからでも呼び出せるぞ。

2. 状態修飾子といって、関数がブロックチェーンとどのように作用し合うのか示してくれるものもある。`view`修飾子は関数が動作しても、なんのデータも保存または変更されないということだ。`pure`修飾子は、関数がブロックチェーンにデータを保存しないだけでなく、ブロックチェーンからデータを読み込むこともないと表しているぞ。どちらも、コントラクト外部から呼び出された場合はガスは必要ない。（ただし、コントラクト内にある別の関数から呼び出されるとガスが必要となるからな。）

3. それからカスタムの`modifier`、例えばレッスン３で学んだ`onlyOwner` や `aboveLevel`というものがある。我々は、これら修飾子の関数への影響の仕方を決定するための、カスタムした理論を定義することが可能だ。

これらの修飾子は、全て以下のように一つの関数定義に組み込むことができる。

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

このチャプターでは、さらにもう一つ`payable`という関数修飾子を紹介して行くからな。

## `payable`修飾子

`payable`関数は、solidityとEthereumをこんなにもクールにしているものの１つといえる。Etherを受け取ることができる特別なタイプの関数なんだ。 

ちょっとじっくりと考えてみよう。お主達が通常のウェブサーバー上でAPI関数を呼び出すとき、ファンクション・コール(関数呼び出し)に併せてUSドルを送ることはできない。ビットコインでもダメだ。

だがイーサリアムでは、お金(Ether)もデータ(トランザクションの内容)も、コントラクト・コード自体も全てイーサリアム上にあるから、ファンクション・コール**及び**お金の支払いが同時に可能だ。

関数を実行するため、コントラクトへいくらかの支払いを要求するというようなすごく面白いこともできてしまうのだ。

## 例を見てみよう
```
contract OnlineStore {
  function buySomething() external payable {
    // Check to make sure 0.001 ether was sent to the function call:
    require(msg.value == 0.001 ether);
    // If so, some logic to transfer the digital item to the caller of the function:
    transferThing(msg.sender);
  }
}
```

ここの`msg.value`は、コントラクトにどのくらいEtherが送られたかを見るやり方で、`ether`は組み込み単位だ。

ではここでweb3.js（DAppのJavaScriptフロントエンドだ）から以下のように関数を呼び出した場合何が起こるだろうか。

```
// Assuming `OnlineStore` points to your contract on Ethereum:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

`value`の部分を見て欲しい。ここではJavaScriptのファンクション・コールで`ether`をどのくらい送るかを定めている(0.001etherだ）。もしトランザクションを封筒のようなものと考えると、ファンクション・コールに渡すパラメーターは、封筒の中に入れた手紙の内容だ。そして`value`を追加するのは、封筒の中に現金を入れるようなものだ。受取人に手紙とお金が一緒に届けられるからな。

>注：関数にpayable修飾子がなく、Etherを上記のように送ろうとする場合、その関数はトランザクションを拒否します。


## それではテストだ

我々のゾンビゲームで`payable`関数を作ってみよう。

例えばこのゲームで、ユーザーがETHを支払って自分のゾンビをレベルアップできる機能があるとしよう。そのETHはお主が所有するコントラクト内に溜まっていくから、ゲームでお金を稼げる一番簡単な例だ！

1. `levelUpFee`という名前の`uint`を定義し、それが`0.001 ether`と同様になるよう設定せよ。

2. `levelUp`という名前の関数を作成せよ。これに一つのパラメーター`_zombieId`（`uint`）を渡せ。また`external`かつ`payable`とせよ。

3. 最初に`msg.value`が`levelUpFee`と同等であることを、この関数が要求（`require`）するようにせよ。

4. そしたらゾンビの`level`を増やすのだ。やり方はこうだ。 `zombies[_zombieId].level++`
