---
title: Miras
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
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

      // Buradan başlayın

    answer: >
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

      contract ZombieFeeding is ZombieFactory {

      }

---

Oyun kodumuz oldukça uzun. Son derece uzun bir kontrat yapmaktansa, bazen kodu organize etmek için kod mantığınızı çoğlu kontratlara bölmek onu anlamlı yapar.

Bunu daha yönetilebilir yapan Solidity'nin bir özelliği de kontrat **_mirası_**:

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

`Doge`'den  `BabyDoge` **_mirasları_**. Bu, `BabyDoge`'u derleyip açarsanız hem `catchphrase()` hem de `anotherCatchphrase()` erişimine sahip olacağı anlamına gelir (ve `Doge`'da belirtebileceğimiz her bir diğer genel fonksiyonlar).

Bu mantıklı miras için kullanılılabilir (bir alt sınıfla olduğu gibi, bir `Cat` bir `Animal`'dır). Fakat ayrıca farklı sınıflar içine benzer mantığı birlikte gruplayarak kodunuzu organize etmek için basitçe kullanılabilir.

# Teste koy

Sonraki bölümlerde, zombilerimizi besleyip çoğaltmak için işlevselliği uyguluyor olacağız. Hadi `ZombieFactory`'den tüm yöntemleri miras alan kendi sahip olduğu sınıf içine bu mantığı koyalım.

1. `ZombieFactory` altında `ZombieFeeding` denilen bir kontrat yapın. Bu kontrat `ZombieFactory` kontratımızdan miras alıyor olmalı.
