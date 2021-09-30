---
title: Import
actions: ['答え合わせ', 'ヒント']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // import ステートメントをここに書け

        contract ZombieFeeding is ZombieFactory {

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

            function _createZombie(string _name, uint _dna) private {
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
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

      }

---

ほれ！　コードが綺麗になってエディタの上にタブができただろう。タブをクリックして自分で試してみると良い。

コードがかなり長くなっているから、いくつかのファイルに分けて把握しやすいようにするぞ。これは実際にSolidityのプロジェクトで長いコードを処理するときに使用している技だから、しっかり頭に入れておくのだ。

ファイルがいくつかある場合で、別のファイルをインポートしたい場合、Solitidy には`import`というものが用意されている。下に例をあげるぞ：

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```
このコントラクトと同じディレクトリ（`./`はそういう意味だ）に `someothercontract.sol`というファイルがあれば、コンパイラがインポートしてくれるぞ。

# それではテストだ

マルチファイルを設定したから、`import`をして他のファイルの中身を読み込む必要がある。

1. 新しく作った`zombiefeeding.sol`から`zombiefactory.sol` をインポートせよ。
