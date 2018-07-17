---
title: Fonksiyon İfadeleri
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

          function createZombie(string _name, uint _dna) {

          }

      }
---

Solidity'de bir fonksiyon ifadesi aşağıdaki gibidir:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Bu iki parametreli `eatHamburgers` isminde bir fonksiyondur: bir `string` ve bir `uint`. Şimdilik fonksiyonun gövdesi boş.

> Not: Onları global değişkenlerden ayırt etmek için fonksiyon parametresi değişken isimlerine bir alt çizgi (`_`) ile başlamak bir düzendir (fakat gerekli değildir). Eğitimimiz boyunca bu düzeni kullanacağız.

Bu fonksiyonu şöyle çağırırsınız:

```
eatHamburgers("vitalik", 100);
```

# Teste koy

Uygulamamızda, bazı zombiler oluşturabilmeye ihtiyacımız olacak. Bunun için bir fonksiyon oluşturalım.

1. `createZombie` isimli bir fonksiyon oluşturun. İki parametre içermeli: **__isim_** (bir `string`), ve **__dna_** (bir `uint`).

Şimdilik gövdeyi boş bırakın — onu daha sonra dolduracağız.
