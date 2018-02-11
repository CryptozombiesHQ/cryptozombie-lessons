---
title: Özel / Genel İşlevler
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
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

      }
---

Solidity'de, işlevler varsayılan olarak `public 'dir. Bu, herkesin (veya herhangi bir sözleşmenin) sözleşmenizin işlevini çağıracağı ve kodunu yürüteceği anlamına gelir.

Açıkçası, bu her zaman istenmeyebilir ve sözleşmenizi saldırılara açık hale getirebilir. Bu nedenle işlevlerini varsayılan olarak 'özel' olarak işaretlemek ve sonra yalnızca dünyaya açmak istediğiniz işlevleri 'kamuya açık' yapmak iyi bir uygulamadır.

Özel bir işlevi nasıl bildirileceğine göz atalım:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```

Bu, yalnızca sözleşmemizdeki diğer işlevlerin bu işleve "sayı" dizisine ekleyebileceği anlamına gelir.

Görebildiğiniz gibi, işlev adından sonra `özel 'anahtar kelimesini kullanıyoruz. İşlev parametrelerinde olduğu gibi, özel işlev adlarını alt çizgi (`_`) ile başlatmak kuraldır.

# Şimdi bunu test edelim

Sözleşmesinin 'createZombie` işlevi şu anda varsayılan olarak kamuya açıktır - bu, herkesin sözleşmemizde yeni bir Zombi yaratması ve çağırması anlamına gelmektedir! Özel yapalım.

1. `CreateZombie` öğesini özel bir işlev olacak şekilde değiştirin. Adlandırma kuralını unutmayın!
