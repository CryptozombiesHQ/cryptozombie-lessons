---
title: İşlev Bildirimleri
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
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          // buradan başlayın

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              uint dna;
              string name;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {

          }

      }
---

** Solidity ** içindeki bir işlev bildirimi aşağıdakine benziyor:

```
function eatHamburgers(string _name, uint _amount) {

}
```

Bu, 2 parametre alan `eatHamburgers` adlı bir işlevdir:` dize` ve `uint`. Şimdilik, işlevin gövdesi boş.

> Not: Genel değişkenlerden ayırt etmek için işlev parametre değişken adlarını alt çizgi (`_`) ile başlatmak kuraldır (ancak gerekli değildir). Bu sözleşmeyi öğreticimiz genelinde kullanacağız.

Bu işlevi şöyle denirsiniz:

```
eatHamburgers("vitalik", 100);
```

# Şimdi bunu test edelim

Uygulamamızda bazı zombi yaratmamız gerekecek. Bunun için bir işlev yaratalım.

1. `CreateZombie` adlı bir işlev oluşturun. İki parametre almalı: **__name_** (bir `string`) ve **__dna_** (bir` uint`).

Şimdilik cesedi boş bırakın - daha sonra dolduracağız.
