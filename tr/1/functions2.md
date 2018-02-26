---
title: Özel / Genel Fonksiyonlar
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

Solidity'de, fonksiyonlar varsayılan olarak `public`tir . Bu, herhangi birinin (veya bir diğer kontratın) kontratınızın fonksiyonunu çağırabileceği ve kendi koduna uygulayabileceği anlamına gelir.

Açıkça bu her zaman istenilir değildir ve ve saldırı için kontratınızı zayıf yapabilir. Dolayısıyla fonksiyonlarınızı varsayılan olarak `private` işaretlemek ve daha sonra sadece dünyaya teşhir etmek istediğiniz fonksiyonları `public` yapmak iyi uygulamadır.

Özel bir fonksiyonun nasıl belirleneceğine bakalım:

```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number) {
}
```

Bu, kontratımızın içindeki yalnızca diğer fonksiyonların bu fonksiyonu çağırabileceği ve `numbers` dizisi ekleyebileceği anlamına gelir.

Gördüğünüz gibi, fonksiyon isminden sonra `private` anahtar kelimesini kullanıyoruz. And as with function parameters, Ve fonksiyon parametrelerinde olduğu gibi, özel fonksiyon isimlerini bir alt çizgi (`_`) ile başlatmak gelenektir.

# Teste koy
 
Kontratımızın `createZombie` fonksiyonu şu anda varsayılan olarak geneldir — bu, herhangi birinin onu çağırabildiği ve kontratımızda yeni bir Zombi oluşturabildiği anlamına gelir! Hadi onu özel yapalım.

1. `createZombie`yi değiştirin yani o bir özel fonksiyondur. Düzeni isimlendirmeyi unutmayın!
