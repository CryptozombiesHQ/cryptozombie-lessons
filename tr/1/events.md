---
title: Etkinlikler
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // declare our event here

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // and fire it here
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Kontratımız neredeyse bitti! Hadi şimdi bir **_etkinlik_** ekleyelim.

**_Etkinlikler_** kontratınız için blok zincirinde olan birşeyin uygulamanızın başlangıç aşamasına iletilmesi için belirli etkinlikler için ‘dinlenebilen’ ve olduğunda harekete geçebilen bir yoldur.

Örnek:

```
// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // uygulamanın fonksiyonu çağırdığı bildirmek için bir etkinlik ateşle: 
  IntegersAdded(_x, _y, result);
  return result;
}
```

Uygulamanızın başlangıç aşaması daha sonra etkinliği dinleyebilir. Bir JavaScript uygulaması şöyle görünür: 

```
YourContract.IntegersAdded(function(error, result) { 
  // sonuç ile birşey yap
}
```

# Teste koy

Başlangıç aşamasının yeni oluşturulmuş bir zombiyi her zaman bilmesine izin vermek için bir etkinlik istiyoruz, böylece uygulama onu görüntüleyebilir.

1. `NewZombie` denilen bir `event` ilan et. `zombieId` (bir `uint`), `name` (bir `string`), ve `dna` (bir `uint`) geçmeli.

2. `zombies` sıralamamıza yeni Zombi ekledikten sonra `NewZombie` etkinliği ateşlemek için `_createZombie` fonksiyonunu değiştir. 
 
3. Zombinin `id` sine ihtiyacınız olacak. `array.push()` yeni sıralama uzunluğunun bir `uint`ni getirir - ve indeks 0'a sahip bir sıralamadaki ilk öğeden dolayı, `array.push() - 1` eklediğimiz zombinin indeksi olacak. `id` denilen bir `uint` içinde `zombies.push() - 1` sonucunu saklayın, böylece sonraki satırda `NewZombie` etkinliği içinde bunu kullanabilirsiniz.
