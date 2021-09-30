---
title: Haritalandırma ve Adresler
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

          // declare mappings here

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
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

Veritabanımızda zombiler vererek oyunumuzu çok oyunculu yapalım.

To do this, Bunu yapmak için, 2 yeni veri türüne ihtiyacımı olacak: `mapping` ve `address`.

## Addresler

Ethereum blok zinciri banka hesapları gibi düşünebileceğiniz **_hesaplardan_**. Bir hesabın **_Ether_** (Ethereum blok zincirinde kullanılan para birimi) bakiyesi vardır ve banka hesabınızın diğer banka hespalarına elektronik para transferi yapabildiği gibi diğer hesaplara Ether ödemeleri gönderebilir ve alabilirsiniz. 

Her hesap bir banka hesap numarası gibi düşünebileceğiniz bir `address'`'e sahiptir. O, hesabı işaret eden özel bir tanımlayıcıdır ve bunun gibi görünür: 

`0x0cE446255506E92DF41614C46F1d6df9Cc969183`

(Bu adres CryptoZombies takımına aittir. CryptoZombies ile eğleniyorsanız, bize biraz Ether gönderebilirsiniz! 😉 )

Sonraki bir derste adreslerin asıl meselesine geleceğiz fakat şimdilik sadece **bir adresin belirli birkullanıcıya ait olduğunu** anlamanız gerekiyor (veya bir akıllı kontrata).

Yani, zombilerimizin sahipliği için onu bir özel kimlik olarak kullanabiliriz. Bir kullanıcı uygulamamızla etkileşerek yeni zombiler oluşturduğunda, fonksiyon olarak çağrulan Ethereum adresine bu zombilerin sahipliğini ayarlayacağız.

## Haritalandırmalar

Ders 1'de **_yapılar_** ve **_sıralamalar_**'a baktık. **_Haritalandırmalar_** Solidiy'de organize edilen verilerin depolanmasının başka bir yoludur.

Bunun gibi bir `mapping` tanımlamak:

```
// Bir finansal uygulama için, kullanıcının hesap bakiyesini tutan bir uint depolamak:
mapping (address => uint) public accountBalance;
// userId'ye bağlı kullanıcı adlarını depolamak/ aramak için kullanılabilir
mapping (uint => string) userIdToName;
```

Bir haritalandırma özellikle veri depolamak ve aramak için bir anahtar değerdir. İlk örnekte, anahtar bir `address`'tir ve değer bir `uint`'tir ve ikinci örnekte anahtar bir `uint` ve değer bir `string`'tir.

# Teste koy

Zombi sahipliği depolamak için, iki haritalandırma kullanacağız: biri sahibi onunan zombinin adresinin izini sürdürür ve diğeri sahibin kaç zombisinin olduğunun izini takip eder.

1. `zombieToOwner` denilen bir haritalandırma oluşturun. Anahtar bir `uint` (kendi kimliğine bağlı zombiyi depolayacağız ve araştıracağız) ve bir `address` değeri olacak. Bu haritalandırmayı `public` yapalım.

2. Anahtarın bir `address` ve bir `uint` değeri olduğu `ownerZombieCount` denilen bir haritalandırma oluşturun.
