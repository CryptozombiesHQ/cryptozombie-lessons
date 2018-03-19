---
title: Immutability of Contracts
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

          // 1. これは削除せよ：
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2.これを単なる宣言に変更せよ：
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. setKittyContractAddress メソッドをここに追加せよ

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

今までやってきてわかっただろうが、SolidityはJavaScriptに似ている言語だ。しかし、イーサリアムのDAppは普通のアプリケーションとはかなり違う点があるから、それを教えていくぞ。

まず、イーサリアムのコントラクトを実行すると、**_イミュータブル_**になる。つまり編集も更新もできなくなるということだ。

コントラクトで実行した初期のコードは永久にブロックチェーン上に残ることになる。これはSolidityにとってセキュリティが極めて重要だからだ。コントラクトに何か欠陥があっても、それをあとで修正する方法はない。その場合は、問題点を直した別のスマートコントラクトを使用してほしいと、他のユーザーに伝えるしかないのだ。

これはスマートコントラクトの機能でもある。コードは法のようなものだ。スマートコントラクトのコードを読んで確かめてみればわかるだろうが、関数を呼び出す毎にコード通りに実行されるはずだ。だれも関数を変更することはできないが、お主が予期しない結果を生じさせることもない。

## 外部依存関係

レッスン 2では、クリプトキティーズのコントラクトのアドレスはハードコードにしたな。ではもしクリプトキティーズのコントラクトにバグがあり、何者かによってすべてのキティーが破壊されたらどうなるかな？

まぁ、実際にこんなことは起こり得ないが、実際に起こった場合、我々のDAppは全く使い物にならなくなる。ハードコードで指定したアドレスで、子猫（キティー）を呼び出せなくなるからだ。ゾンビは子猫たちを餌にすることができなくなり、しかもコントラクトを修正して直すこともできないのだ。

こうした理由で、大切な部分に関してはDAppを更新できる機能があったほうがいいのだ。

例えば、クリプトキティーズのコントラクトをハードコーディングする代わりに、`setKittyContractAddress`という関数を設定しておけば、あとでクリプトキティーズのコントラクトに何かあった場合には、アドレスが変更できるようにできるのだ。わかるな。

## それではテストだ

レッスン2で使ったクリプトキティーズコントラクトのアドレスを変更できるように変えるのだ。

1. ハードコードした`ckAddress`の行を削除せよ

2. `kittyContract`を作成した行を、単なる変数の宣言に変更せよ(変数に何もセットしてはならない)

3. `setKittyContractAddress`という関数を作成せよ。引数を`_address` ( `address`)とすること。また`external`関数で設定せよ。

4. 関数の中に1行を加え、`kittyContract`が`KittyInterface(_address)`と同様になるように設定せよ

> 注：この関数でセキュリティホールが見つかった場合でも、無視して構いません。次のチャプターで修正します　;)

