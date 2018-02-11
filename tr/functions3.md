---
title: Fonksiyonlar hakkında daha fazlası
actions: ['checkAnswer', 'hints']
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

          // buradan başlayın

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

          function _generateRandomDna(string _str) private view returns (uint) {

          }

      }
---

Bu bölümde İşlev **_dönüş değerleri_** ve işlev değiştiriciler hakkında bilgi edineceğiz.

## Dönüş Değerleri

Bir işlevden bir değer döndürmek için bildirim şöyle görünür:

```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

Sağlamlıkta işlev bildirimi dönüş değerinin türünü (bu durumda `string`) içerir.

## İşlev değiştiriciler

Yukarıdaki işlev katılıkta aslında durumu değiştirmez - ör. herhangi bir değeri değiştirmez veya bir şey yazmaz.

Dolayısıyla bu durumda **_view_** işlevi olarak beyan edebiliriz, yani yalnızca veriyi izlemekte ancak bunu değiştirmemektedir:

```
function sayHello() public view returns (string) {
```

Sağlamlık ayrıca **_pure_** işlevleri içeriyor; bu, uygulamanın herhangi bir verisine bile erişmediğiniz anlamına geliyor. Aşağıdakileri göz önünde bulundur:

```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Bu işlev, uygulamanın durumundan bile okunamıyor - dönüş değeri yalnızca işlev parametrelerine bağlı. Dolayısıyla bu durumda fonksiyonu **_pure_** olarak ilan ederdik.

> Not: Fonksiyonların ne zaman saf / görüntü olarak işaretleneceğini hatırlamak zor olabilir. Neyse ki Solidity derleyicisi, bu değiştiricilerden birini ne zaman kullanmanız gerektiğini bildiren uyarıların verilmesi konusunda iyi bir fikir.

# Şimdi bunu test edelim

Bir dizeden rasgele bir DNA numarası üreten bir yardımcı işlevi isteyeceğiz.

1. `_generateRandomDna` adlı bir 'özel' işlev oluşturun. `_str` (bir` string`) adlı bir parametre alır ve `uint` döndürür.

2. Bu işlev sözleşmemizin bazı değişkenlerini görüntüler, ancak bunları değiştirmez; bu nedenle bunu `view` olarak işaretleyin.

3. İşlevin gövdesi bu noktada boş olmalı - daha sonra dolduracağız.
