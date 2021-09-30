---
title: onlyOwner 関数の修飾子
actions: ['答え合わせ', 'ヒント']
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

          KittyInterface kittyContract;

          // 関数を編集せよ：
          function setKittyContractAddress(address _address) external {
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
---

さて、`ZombieFactory`が`Ownable`をうまく継承できたようだな。では、`ZombieFeeding`の `onlyOwner`関数修飾子も使用できるようになっているはずだ。

コントラクトの継承がしっかり機能しているからな。思い出してもらいたい：

```
ZombieFeeding は ZombieFactory
ZombieFactory は Ownable
```

したがって`ZombieFeeding`もまた`Ownable`ということになり、`Ownable`のコントラクトから関数/イベント/修飾子にアクセスできるというわけだ。今後`ZombieFeeding`を継承するコントラクトも全てこれと同じようになるから覚えておくようにな。

## 関数修飾子

関数修飾子は一見関数のように見えるが、`function`の代わりに`modifier`を使うのでわかりやすいだろう。また、関数のように直接呼び出すことはできず、代わりに関数定義の最後に修飾子の名前をつけることで、関数の動きを変更するのだ。

`onlyOwner`についてもう少し詳しく説明するから、しっかりついてこいよ：

```
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

この修飾子を次のように使う。

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  //`onlyOwner`の使い方を確認せよ：
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

`likeABoss`関数の`onlyOwner`修飾子を見るのだ。`likeABoss`を呼び出すと `onlyOwner`の中のコードが**最初に**実行されるのがわかるだろう。それから`onlyOwner`の`_;`ステートメントにたどり着いた時に、`likeABoss`に戻ってコードを実行するようになっているのだ。

修飾子は他にも色々な使い方ができるが、いちばん一般的なのは関数の実行前に`require`でサクッとチェックする使い方だ。

`onlyOwner`の場合、この修飾子を関数に追加することで、 **オーナー** （実行するのがお主の場合は、お主になる）**だけが**関数を呼び出せるようになる。

>注：オーナーにこのような特別な権限を与えることは必要なことですが、濫用される恐れもあります。例えば、オーナーがバックドアの機能を勝手に追加して、誰かのゾンビをオーナーに移してしまうこともできます！

>こういう事態も起こり得るので、DAppがイーサリアム上にあるというだけで、全てが分散型になっているというわけではないことを、常に念頭に入れておいてください。気になる部分については、すべてのソースコードに目を通して、オーナーに特別な力がないことを確認する必要があります。開発者としてバグを修正するようにDAppをコントロールする権限が必要な一方で、オーナーの数を少なくしてユーザーのデータの安全性を確保できるようなプラットフォームを開発をすることも重要であり、両者のバランスに常に気をつける必要があります。

## それではテストだ

`setKittyContractAddress` へのアクセスを制限して、我々以外のだれも編集できないようにしたい。

1. `onlyOwner`修飾子を`setKittyContractAddress`へ追加せよ。
