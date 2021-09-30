---
title: Keccak256 ve Typecasting
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              // start here
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

`_generatePseudoRandomDna` fonksiyonumuzun rastgele bir (yarım) `uint` getirmesini istiyoruz. Bunu nasıl başarabiliriz?

Ethereum'un yapılmış SHA3'ün bir sürümü `keccak256` hash fonksiyonu vardır. Bir hash fonksiyonu temel olarak rastgele bir 256-bit onaltılı sayı içine bir giriş dizisi planlar. Dizideki az bir değişiklik hashdeki büyük bir değişime neden olur.

Ethereum'daki birçok amaç için kullanışlıdır fakat şu an için onu sözde rastgele sayı oluşturmak için kullanacağız.

Örnek:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Gördüğünüz gibi, getirilen değerler girişte sadece bir 1 karakter değişmesine rağmen tamamen farklıdır.

> Not: Blok zincirinde rastgele sayı oluşturmayı **güven altına almak** çok zor bir problemdir. Buradaki yöntemimiz güvensizdir fakat Zombi DNA'mız için güvenlik yüksek önceliğimiz olmadığından, amaçlarımız için yeterince iyi olacaktır.

## Typecasting
 
Bazen veri tipleri arasında dönüşüm yapmanız gerekir. Aşağıdaki örneği alın:

```
uint8 a = 5;
uint b = 6;
// throws an error because a * b returns a uint, not uint8:
uint8 c = a * b; 
// we have to typecast b as a uint8 to make it work:
uint8 c = a * uint8(b); 
```

Yukarıda, `a * b` bir `uint` getirir fakat onu otansiyel problemlere neden olabilen bir `uint8` olarak depolamaya çalışıyoruz. Bir `uint8` olarak çıkararak o çalışır ve derleyici bir hata vermeyecektir.

# Teste koy

Hadi `_generatePseudoRandomDna` fonksiyonumuzun gövdesini dolduralım! İşte yapılması gereken şey:

1. Kodun ilk satırı sözde rastgele bir onaltılı oluşturmak için `_str`nin `keccak256` hashini almalıdır, bir `uint` olarak typecastleyin ve son olarak `rand` denilen bir `uint` içinde sonucu depolayın.

2. DNA'mızın sadece 16 basamak uzunluğunda olmasını istiyoruz (`dnaModulus`u hatırladınız mı?). Yani kodun ikinci satırı yukardaki değer modulusu (`%`) `dnaModulus`u `return` yapmalı.
