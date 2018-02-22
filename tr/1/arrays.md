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

Bir şeyin bir koleksiyonunu istediğinizde, bir **_sıralama_** (array) kullanabilirsiniz. Solidity'de iki tür sıralama vardır: **_sabit_** sıralamalar ve **_dinamik_** sıralamalar:

```
// İki öğeli sabit uzunlukta sıralama:
uint[2] fixedArray;
// diğer sabitlenmiş Sıralama, 5 dizi içerebilir: 
string[5] stringArray;
// bir dinamik Sıralama - sabit bir boyutu yok, büyümeyi sürdürebilir:
uint[] dynamicArray;
```

**_Yapılar_**'ın bir sıralamasını da oluşturabilirsiniz. Önceki bölümün `Person` yapısını kullanarak: 

```
Person[] people; // dinamik Sıralama, ona eklemeyi sürdürebiliriz.
```

Durum değişkenlerinin blok zincirinde kalıcı olarak saklandığını hatırlıyor musun? Yani bunun gibi yapıların bir dinamik sıralamasını oluşturmak, yapılandırılmış verinin bir veritabanı türü gibi kontratınızda saklanması için kullanışlı olabilir.

## Genel Sıralamalar

Bir sıralamayı `public` olarak ilan edebilirsiniz ve Solidity otomatik olarak onun için bir **_gaz alıcı_** oluşturacak. Söz dizimi şöyle görünüyor: 

```
Person[] public people;
```

Diğer kontratlar daha sonra bu diziyi okuyabilir (ancak yazamaz). Bu genel verilerin kontratınıza depolanması için yararlı bir model.

# Teste koy

Uygulamamızda bir zombi ordusu depolamak isteyeceğiz. Ve zombilerimizi tüm diğer uygulamalara göstermek isteyeceğiz, böylece onun genel olmasını isteyeceğiz.

1. `Zombie` **_yapıları_**'nın bir genel sıralamasını oluştur ve onu `zombies` olarak isimlendir.
