---
title: Storageのコストは高い
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
            // ここから開始せよ
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

          return result;
        }

      }
---

Solidityで`storage`への操作は高コストだ。特に書き込みはとても高い。

なぜかというと、データを書き込んだり、変更するたびに、それがすべてブロックチェーンに永久に書き込まれるからだ。永久にだ！世界中の何千個というノードがすべてそのデータをハードドライブに書き込む必要があり、そのデータ容量はブロックチェーンが成長すればするほど大きくなるのだ。だからどうしてもコストは高くなる。

そこで、コストを抑えるために、絶対に必要な場合を除いてデータをstorageに書き込まないようにするのだ。そのため、一見非効率的なロジックを作ることもある。例えば、単純に配列を変数に保存するかわりに、関数を呼び出す毎に`memory`上の配列を再構築するとか、だ。

他のほとんどのプログラム言語では、大きなデータセットをループするのは高コストだ。しかしSolidityでは（`external view`関数の場合は）その方が`storage`を使うよりも低コストとなる。`view`関数はガスを必要としないからだ。（ガスはユーザーに実際にお金を消費させるものだということを忘れるなよ！）。

次のチャプターでは`for`ループを教えるが、まずはmemory内でどうやって配列を宣言するのかを教えるからよく聞いておくようにな。

## memory内で配列を宣言する

関数の中で`memory`キーワード付きで配列を生成すると、storageに書き込むことなく新しい配列を作ることができる。配列は関数内でのみ存在するから、`storage`の配列を更新するよりも圧倒的にガスのコストを抑えることができるのだ。さらに外部から呼び出される`view`関数の場合は、コストはかからない。

memory内の配列の宣言方法はこうだ：

```
function getArray() external pure returns(uint[]) {
  // 長さ3の新しい配列をメモリ内にインスタンス化する
  uint[] memory values = new uint[](3);
  // 値を追加しよう
  values.push(1);
  values.push(2);
  values.push(3);
  // 配列を返す
  return values;
}
```

この例は簡単なものだが、次のチャプターでは`for`ループと組み合わせた使い方を教えていくぞ。

>注：memoryの配列は**必ず**長さを指定して作成する必要があります（この例では`3`）。現在はstorage配列のように`array.push()`でサイズを変えることはできませんが、Solidityの将来のバージョンでは可能になるかもしれません。

## それではテストだ

`getZombiesByOwner`関数では、特定のユーザーが保有している全てのゾンビを、`uint[]`配列として返したい。

1. `result`という名前の `uint[] memory`変数を宣言せよ

2. それを新しい`uint`配列と同等になるよう設定せよ。配列の長さは`_owner`の所有するゾンビ数とする。ゾンビ数はmappingからこのようにして参照できる: `ownerZombieCount[_owner]`

3. 関数の最後で `result`を返せ。今の所は空の配列で構わない。中身は次のチャプターで入れていく。
