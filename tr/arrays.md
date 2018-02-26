---
title: Arrays
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

      }
---

Bir şey koleksiyonu istediğinizde, bir **_dizi_** kullanabilirsiniz. Sağlamlıkta iki tür dizi vardır: **_sabit_** diziler ve **_dinamik_** diziler:

```
// Sabit uzunluklu 2 elementli dizi:
uint[2] fixedArray;
// başka bir sabit Array, 5 dizeler içerebilir:
string[5] stringArray;
// Dinamik bir Array - sabit bir boyutu yoktur, büyüyebilir:
uint[] dynamicArray;
```

**_structs_** dizisini de oluşturabilirsiniz. Bir önceki bölümdeki `Kişi 'yapısını kullanarak:

```
Person[] people; // Dinamik Array, ona eklemeye devam edebiliriz
```

Durum değişkenlerinin blok zincirinde kalıcı olarak saklandığını hatırlıyor musun? Dolayısıyla, dinamik bir yapı dizisi dizisi oluşturmak, yapılandırılmış verileri sözleşmenize depolamak için yararlı olabilir, türden bir veritabanı gibi.

## Genel Diziler

Bir diziyi 'public' olarak bildirebilirsiniz ve Solidity otomatik olarak bunun için bir **_getter_** yöntemi oluşturacaktır. Sözdizimi şu şekilde görünür:

```
Person[] public people;
```

Diğer sözleşmeler daha sonra bu diziyi okuyabilir (ancak yazamaz). Bu, kamu verilerinin sözleşmenize depolanması için yararlı bir model.

# Şimdi bunu test edelim

Uygulamamızda bir zombi ordu saklamayı isteyeceğiz. Ve tüm zombilerimizi diğer uygulamalara göstermek isteyeceğiz, dolayısıyla bunu herkesin görmesini isteyeceğiz.

1. `Zombie` **_structs_** genel bir dizi oluşturun ve ona` zombi` adını verin.
