---
title: Yapılar
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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

      }
---

Bazen daha karışık bir veri türüne ihtiyacınız olur. Bunun için, Solidity **_yapılar_** sağlar:

```
struct Person {
  uint age;
  string name;
}

```

Yapılar çoklu özelliklere sahip daha komplike veri türlerini oluşturmanıza izin verir.

> Yeni bir tür `string` sunduğumuza dikkat edin. Diziler keyfi uzunlukta UTF-8 verisi için kullanılır. Örn. `string greeting = "Merhaba Dünya!"`

# Teste koy

Uygulamamızda, bazı zombiler oluşturmak isteyeceğiz! Ve zombilerin çoklu özellikleri olacak, yani bu bir yapı için mükemmel bir kullanım durumudur.

1. `Zombie` isimli bir `struct` oluştur.

2. `Zombie` yapımız 2 özelliğe sahip olacak: `name` (bir `string`), ve `dna` (bir `uint`).
