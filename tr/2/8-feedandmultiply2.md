---
title: Zombie DNA'sı
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // buradan başla
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Hadi `feedAndMultiply` fonksiyonunu yazmayı bitirelim.

Yeni bir zombi DNA'sı hesaplamak için formül basittir: Beslenen zombinin DNA'sı ve hedefin DNA'sı arasında ortalama almak basittir. 

Örneğin:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ 3333333333333333'e eşit olacak
}
```

Daha sonra istersek formülümüzü yeni zombinin DNA'sına bazı rastgelelikler eklemek gibi daha karışık yapabiliriz. Fakat şimdilik bunu basit tutacağız — ona her zaman geri dönebiliriz.

# Teste koy

1. İlk olarak `_targetDna`'nın 16 basamaktan uzun olmadığına emin olmamız gerekiyor. Bunu yapmak için, sadece 16 basamak alması için `_targetDna`yı `_targetDna % dnaModulus`a eşitleyebiliriz.

2. Sonraki fonksiyonumuz `newDna` isimli bir `uint` belirlemeli ve `myZombie`'nin DNA'sının ve `_targetDna`'in ortalamasına eşit olarak ayarlamalıdır (yukarıdaki örnekte olduğu gibi).

  > Not: `myZombie.name` ve `myZombie.dna` kullanarak `myZombie`'nin özelliklerine erişebilirsiniz

3. Yeni DNA'mız olduğunda, `_createZombie`'yi çağıralım. Bu fonksinun çağırması için hangi parametreler olduğunu unuttuysan `zombiefactory.sol` sekmesine bakabilirsin. Bir isim gerektirdiğine dikkat edin, şimdilik zombimizin ismini `"NoName"` olarak ayarlayalım — daha sonra zombinin ismini değiştirmek için bir fonksiyon yazabiliriz.

> Not: Sizin için Solidity vızıldar, burdaki kodumuzda bir problem farkedebilirsiniz! Endişelenmeyin, bunu sonraki bölümde düzelteceğiz ;)
