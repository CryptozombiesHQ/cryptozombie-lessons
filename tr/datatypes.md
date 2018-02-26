---
title: Durum Değişkenleri ve Tamsayılar
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //buradan başlayın

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

İyi iş! Sözleşmemiz için bir kabuk bulduğumuza göre, Solidity'nin değişkenlerle nasıl uğraştığını öğrenelim.

**_Durum değişkenleri_** kalıcı olarak sözleşme deposunda saklanır. Bu, Ethereum blok zincirine yazıldığı anlamına gelir. Onları DB'ye yazmak gibi düşünün.

##### Örnek:
```
contract ornek {
  // Bu, kalıcı olarak blockchainde saklanacaktır.
  uint myUnsignedInteger = 100;
}
```

Bu örnek sözleşmede, `myUnsignedInteger` adlı bir` uint 'oluşturduk ve 100'e eşit olarak ayarladık.

## Unsigned Integers: `uint`

`Uint` veri tipi, ** değerinin negatif olmaması gereken ** anlamındaki işaretsiz bir tam sayıdır. Ayrıca imzalanmış tamsayılar için bir 'int' veri türü vardır.

> Not: Solidity'de, `uint` aslında` uint256` için bir takma addır, 256 bitlik bir işaretsiz tamsayıdır. Uints'i daha az bit ile - uint8`, `uint16`,` uint32` gibi vesaik olarak bildirebilirsiniz. Fakat genel olarak, daha sonraki derslerde bahsedeceğimiz özel durumlar haricinde, yalnızca uint işlevini kullanmak istersiniz.

# Şimdi bunu test edelim

Zombie DNA'sı 16 basamaklı bir sayı ile belirlenecek.

`DnaDigits 'adında bir' uint 'bildirin ve onu` 16`'ya eşit olarak ayarlayın.
