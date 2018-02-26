---
title: Olaylar
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // olayımızı burada ilan et

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // ve komutu burada ateşleyin
          } 

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
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

          function _generateRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createRandomZombie(string _name) public {
              uint randDna = _generateRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Sözleşmemiz neredeyse bitti! Şimdi bir **_etkinlik_** ekleyelim.

**_Olaylar_**, sözleşmenizin blok zincirinde gerçekleşen bir şeyin, belirli önlemlerin "dinlediği" ve gerçekleştiklerinde harekete geçebilen uygulama ön uçlarınıza bildirilmesi için bir yol.

Örnek:

```
// olayı ilan et
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // uygulamanın işlevinin çağrıldığını bildirmek için bir etkinlik başlattı:
  IntegersAdded(_x, _y, result);
  return result;
}
```

Ardından uygulamanızın ön uç kısmı, etkinliği dinleyebilir. Bir javascript uygulaması aşağıdakine benzeyecektir:

```
YourContract.IntegersAdded(function(error, result) { 
  // sonuç ile bir şeyler yapmak
}
```

# Şimdi bunu test edelim

Bir etkinliğin yeni bir zombi oluşturulduğu her seferinde ön uçumuza haber vermesini istiyoruz, böylece uygulama gösterebilir.

1. `NewZombie` adlı bir` olay` deyin. `ZombieId` (`uint`), `name` (`string`) ve `dna` (`uint`)'dan geçmelidir.

2. `_createZombie` işlevini yeni zombi'yi` zombies` dizimize ekledikten sonra `NewZombie` olayını tetiklemek için değiştirin.

3. Zombi `id`ye ihtiyacınız olacak. `array.push ()` dizinin yeni uzunluğunun bir uint'ini döndürür - ve bir dizideki ilk öğe 0 dizinine sahip olduğundan, array.push () - 1 'sadece zombi dizini olacaktır katma. `Zombies.push () - 1` sonucunu` id` adlı bir `uint` alanına kaydedin, böylece bunu bir sonraki satırdaki` NewZombie` olayında kullanabilirsiniz.
