---
title: Import
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        // put import statement here

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

Whoa! Doğrulamak için kodu bitirdiğimi fark edeceksin ve şimdi düzenleyicinizin üstünde sekmeleriniz var. Devam edin, denemek için sekmelerin arasına tıklayın.

Kodumuz oldukça uzun sürdü, bu nedenle onu daha yönetilebilir yapmak için onu çoklu dosyalara ayırdık. Bu normalde Solidity projelerinizde uzun kod temellileri nasıl uygulayacağınızdır.

Çoklu dosyalarınız olduğunda ve birini diğeri içine import etmek istediğinizde, Solidity `import` anahtar kelimesini kullanır:

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Yani bu kontrat gibi aynı dizin içinde `someothercontract.sol` isimli bir dosyamız olsaydı (bu `./` anlamının ne olduğudur), derleyici tarafından importlanırdı.

# Teste koy

Şimdi bir çoklu dosya yapısı kurduk, diğer dosyaların içeriklerini okumak için `import` kullanmamız gerekiyor:

1. `zombiefactory.sol`'i yeni dosyanmız `zombiefeeding.sol`'a aktar. 
