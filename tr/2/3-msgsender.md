---
title: Msg.sender
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
              // start here
              NewZombie(id, _name, _dna);
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
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
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Artık kimin bir zombi sahibi olduğunun izlenmesini sürdürmek için haritalandırmamız var, onları kullanmak için `_createZombie` yöntemini güncellemek isteyeceğiz.

Bunu yapmak için, `msg.sender` denilen bir şeyi kullanmamız gerek.

## msg.sender

Solidity'de, tüm fonksiyonlarda mevcut olan belli global değişkenler vardır. Bunlardan biri geçerli fonksiyonu çağıran kişinin (veya akıllı kontratın) `address`'ine başvuran `msg.sender`'dir. 

> Dikkat: Solidity'de, fonksiyon uygulaması her zaman harici bir çağırıcı ile başlatmaya ihtiyaç duyar. Bir kontrat birisi onun fonksiyonlarından birini çağırana kadar hiç birşey yapmadan blok zincirinde bulunacaktır. Yani her zaman bi `msg.sender` olacaktır.

`msg.sender` kullanımının ve bir `mapping` güncellemenin bir örneği buradadır:

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Update our `favoriteNumber` mapping to store `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ The syntax for storing data in a mapping is just like with arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Retrieve the value stored in the sender's address
  // Will be `0` if the sender hasn't called `setMyNumber` yet
  return favoriteNumber[msg.sender];
}
```
 
Bu saçma örnekte, her hangi biri kontratımıza kendi adreslerine bağlanabilecek `setMyNumber` çağırabilir ve bir `uint` depolayabilirdi. Sonra `whatIsMyNumber`'i çağırdıklarında depoladıkları `uint`'i çağırırlardı. 

`msg.sender` kullanmak size Ethereum blok zinciri güvenliğini verir — birinin başka birisinin verilerinin değiştirmesinin tek yolu onların Ethereum adresi ile ilişkili özel anahtarını çalmak olurdu.

# Teste koy

Fonksiyonu çağırana zombi sahipliği atamak için ders 1'den `_createZombie` yöntemimizi güncelleyelim.

1. Önce, yeni zombinin `id`'sini geri aldıktan sonra, `msg.sender`i bu `id` altında depolamak için `zombieToOwner` haritalandırmamızı güncelleyelim.

2. İkinci olarak, bu `msg.sender` için `ownerZombieCount`'i arttıralım.

Solidity'de, javascriptteki gibi bir `uint`'i `++` ile arttırabilirsiniz:

```
uint number = 0;
number++;
// `number` şimdi `1`
```

Bu bölüm için son cevabınız iki satır kod olmalı.
