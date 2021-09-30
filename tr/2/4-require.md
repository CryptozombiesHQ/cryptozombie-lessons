---
title: İstek
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
              // start here
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
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
---

Ders 1'de, onu kullanıcıların `createPseudoRandomZombie` çağırarak ve bir isim girerek oluşturabileceği şekilde yaptık. Ancak, kullanıcılar ordularında sınırsız zombi oluşturmak için bu fonksiyonu çağırmayı sürdürebilseydi, oyun çok eğlenceli olmazdı.

Onu, her oyuncunun bu fonksiyonu bir kez çağırabileceği şekilde yapalım. Bu yolla yeni oyuncular ordularındaki ilk zombiyi oluşturmak için oyunu ilk başlattıklarında onu çağıracaklar.

Bu fonksiyonu oyuncu başına sadece bir kez çağrılabileceği şekilde nasıl yaparız? 

Bunun için `require` kullanırız. `require` onu bir şart doğru değilse fonksiyonun hata fırlatacağı ve uygulamayı durduracağı şekilde yapar:
```
function sayHiToVitalik(string _name) public returns (string) {
  // Compares if _name equals "Vitalik". Throws an error and exits if not true.
  // (Side note: Solidity doesn't have native string comparison, so we
  // compare their keccak256 hashes to see if the strings are equal)
  require(keccak256(_name) == keccak256("Vitalik"));
  // If it's true, proceed with the function:
  return "Hi!";
}
```

Bu fonksiyonu `sayHiToVitalik("Vitalik")` ile çağırırsanız, "Merhaba!" getirecektir. Onu herhangi bir diğer giriş ile çağırırsanız, bir hata çıkaracak ve uygulamayacaktır.

Böylelikle `require`, bir fonksiyonun çalışmasından önce doğru olması gereken belirli koşulları doğrulamak için oldukça kullanışlıdır.

# Teste koy

Zombi oyunumuzda, bir kullanıcının aralıksız olarak `createPseudoRandomZombie` çağırmasıyla zombi ordularında sınırsız zombi oluşturabilmelerini istemiyoruz — bu oyunu daha eğlenceli yapmaz.

İlk zombilerini oluşturduklarında, bu fonksiyonun kullanıcı başına bir kere uygulandığından emin olmak için `require` kullanalım.

1. `createPseudoRandomZombie` başlangıcında bir `require` koşulu koyun. Fonksiyon `ownerZombieCount[msg.sender]`'in `0`'a eşit olduğundan emin olmak için denetlemeli ve aksi takdirde hata çıkarır.

> Not: Solidity'de, ilk hangi terimi koyduğunuzun önemi yoktur — her iki sıra da eşdeğerdir. Ancak, cevap tarayıcımız gayet temel olduğundan, sadece bir cevabı doğru olarak kabul edecektir — `ownerZombieCount[msg.sender]`'in ilk gelmesi için bekliyor.
