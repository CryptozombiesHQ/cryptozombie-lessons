---
title: Fonksiyonlar Hakkında Dahası
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

          // start here

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

          }

      }
---

Bu bölümde, Fonksiyon **_değerleri getirmeyi_** ve fonksiyon değiştiricileri öğreneceğiz.

## Değerleri Getirme

Bir fonksiyondan bir değer getirmek için, ifade şuna benzer:

```
string greeting = "Naber köpek";

function sayHello() public returns (string) {
  return greeting;
}
```

Solidity'de, fonksiyon ifadesi değer getirme türü içerir (bu durumda `string`).

## Fonksiyon değiştiriciler

Yukardaki fonksiyon aslında Solidity'de durumu değiştirmez — örn. bir değeri değiştirmez veya hiçbir şey yazmaz.

Yani bu durumda onu, veriyi görüntüleyen fakat değiştirmeyen anlamında **_görüntü_** fonksiyonu olarak ifade edebilirdik:

```
function sayHello() public view returns (string) {
```

Solidity ayrıca uygulamadaki bir veriye tam erişemediğiniz anlamına gelen **_saf_** fonksiyonlar içerir. Aşağıdaki duruma bakın:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Bu fonksiyon uygulamanın durumundan tam okumuyor — getirdiği değer sadece kendi fonksiyon parametrelerine bağlıdır. Yani bu durumda fonksiyonu **_saf_** olarak ifade edebiliriz.

> Not: Fonksiyonların ne zaman saf/görüntü olarak işaretleneceğini hatırlamak zor olabilir. Neyse ki Solidity derleyicisi, bu değiştiricilerden birini ne zaman kullanmanız gerektiğini bildiren uyarıların verilmesi konusunda iyidir.

# Teste koy

Bir diziden rastgele bir DNA sayısı oluşturan yardımcı bir fonksiyon isteyeceğiz.

1. `_generatePseudoRandomDna` denilen `private` bir fonksiyon oluşturun. `_str` (bir `string`) isimli bir parametre alacak ve bir `uint` getirecek.

2. Bu fonksiyon kontratlarımızın değişkenlerinin bazılarını görecek fakat onları değiştirmeyecek, yani onu `view` olarak işaretleyin.

3. Fonksiyon gövdesi bu sırada boş olmalıdır — onu daha sonra dolduracağız.
