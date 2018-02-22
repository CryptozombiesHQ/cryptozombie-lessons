---
title: Hal Değişkenleri & Tam Sayılar
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          //start here

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;

      }
---

Aferin! Şimdi kontratımız için bir iskelet bulduk, hadi Solidity'nin değişkenlerle nasıl iş yaptığını öğrenelim.

**_Hal_değişkenleri_** kontrat deposunda kalıcı olarak depolanır. Bu Ethereum blok zinciri için yazıldığı anlamına gelir. Onları bir veritabanına yazmak gibi düşünün. 

##### Örnek:
```
contract Example {
  // Bu kalıcı olarak blok zincirinde depolanacak
  uint myUnsignedInteger = 100;
}
```

Bu örnek kontratta, `myUnsignedInteger` denilen bir `uint` oluşturduk ve 100'e eşit olarak ayarladık.

## İşaretsiz Tam Sayılar: `uint`

`uint` veri türü **değeri negatif olmaması gereken** bir işaretsiz tam sayıdır. Ayrıca işaretli tam sayılar için bir `int` veri türü de vardır.

> Not: Solidity'de, `uint` 256-bit işaretsiz bir tam sayı olan`uint256` için aslında bir sahte isimdir. Daha az bits ile uintleri ilan edebilirsiniz — `uint8`, `uint16`, `uint32`, vs.. Ama genelde sonraki derslerde konuşacağımız özel durumlar dışında basitçe `uint` kullanmak istersiniz.

# Teste koy

Zombi DNA'mız 16 haneli bir sayı tarafından belirlenecek.

`dnaDigits` isimli bir `uint` ilan et ve `16`ya eşit olacak şekilde ayarla.
