---
title: For ループ
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

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // ここから開始せよ
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

前のチャプターでは、関数内で配列を構築する際に、単にstorageに保存するかわりに`for`ループを使用して作りたい場合もあると言ったな。

その理由を説明しよう。

`getZombiesByOwner`関数を素直に実装しようとするなら、オーナーからゾンビ軍団への`mapping`を`ZombieFactory`コントラクトに持たせればいいだろう：

```
mapping (address => uint[]) public ownerToZombies
```

新しいゾンビを作る度に、`ownerToZombies[owner].push(zombieId)`を使ってオーナーのゾンビ配列に追加していくだけだ。すると`getZombiesByOwner`は非常にシンプルな関数になる：

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### この方法の問題点

この方法は簡単だから、つい使いたくなってしまう。だがゾンビを誰かに譲る関数をあとで作成した時に問題が起こる（後のレッスンで教えるから、しばし待つのだ！）。

その関数には次の動作が必要になる：
1. ゾンビを新しいオーナーの`ownerToZombies`配列に追加する
2. 元のオーナーの`ownerToZombies`配列からゾンビを削除する
3. 穴を埋めるために、元のオーナーの各ゾンビの配列の番号を変更する
4. 配列のlengthを1 減らす。

ステップ 3は、ゾンビの位置を全てずらすことになるから、ガスコストは非常に高額になってしまう。もしオーナーがゾンビを20体持っていて、最初のゾンビを誰かにあげたとする。すると残りの19体の配列番号を書き直さなくてはならなくなるのだ。

storageに書き込むことはSolidityの操作で一番ガスコストがかかるものだから、このゾンビを誰かに譲る関数を実行するたびに、莫大なガスコストが発生してしまうのだ。さらに悪いことに、ユーザーがどれくらいのゾンビを所有していて、何番目のゾンビを譲るのかによってガスのコストが変わってしまうのだ。だからユーザーはどのくらいガスが必要なのか、実行するまでわからないのだ。

> 注：もちろん、譲ったゾンビの場所に、配列の最後のゾンビを移動して、穴埋めに使う方法はあります。しかしその場合、取引の度にゾンビ軍団の順番を変えなければならなくなります。

この場合、`view`関数は外部から呼び出した時にガスコストがかからないから、`getZombiesByOwner`内でforループを使ってそのオーナーのゾンビ軍団の配列を作ってしまえばいい。そうすれば`transfer`関数はstorage内の配列を並び替える必要がないため安く抑えられるし、直感的ではないにしろ全体のコストも抑えられる。

## `for` ループを使う

Solidityの`for`ループはJavaScriptと同じようなものだと考えていい。

偶数の数字を格納する配列の例を出すぞ：

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // 新しい配列のインデックスをトラックする：
  uint counter = 0;
  // 1から10までループさせる：
  for (uint i = 1; i <= 10; i++) {
    // もし `i` が偶数なら...
    if (i % 2 == 0) {
      // 配列に格納する
      evens[counter] = i;
      // カウンタを増やして `evens`の空のインデックスにする：
      counter++;
    }
  }
  return evens;
}
```

この関数は`[2, 4, 6, 8, 10]`の配列を返す。

## それではテストだ

`getZombiesByOwner`を完成させよ。`for`ループでDApp内の全てのゾンビをループさせ、オーナーが一致するかどうかを判定し、`result` 配列に格納して返却せよ。

1. `counter`という`uint`を宣言し、`0`に設定せよ。この変数は`result`配列のインデックスとして使用する。

2. `uint i = 0`から始めて、`i < zombies.length`までループする`for`ループを宣言せよ。このループは配列内の全てのゾンビをイテレートする。

3. `for`ループ内に`if`ステートメントを作成し、`zombieToOwner[i]`が`_owner`と一致するか判定せよ。２つのアドレスを比較することでチェックしているのだ。

4. `if`ステートメント内部には以下を設定せよ：
   1. `result`配列内にゾンビのIDを追加せよ。`result[counter]`を`i`と同等になるよう設定するだけでよい。
   2. `counter`を 1 増やせ。(`for`ループの例を参考にするのだ）。

これでいい。`_owner` が所有する全てのゾンビが返るはずだ。しかもガスは一切不要だ。
