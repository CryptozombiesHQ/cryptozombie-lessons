---
title: Yapılarla ve Sıralamalarla çalışmak
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
              // start here
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

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Yeni Yapılar Oluşturmak

Önceki örnekteki bizim `Person` yapısını hatırlıyor musun?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Şimdi yeni `Person`ların nasıl oluşturulacağını ve onlara `people` sıralamamızı eklemeyi öğreneceğiz.

```
// Yeni bir Person oluştur:
Person satoshi = Person(172, "Satoshi");

// Bu kişiye bir Sıralama ekle:
people.push(satoshi);
```

Ayrıca, bunları birlikte kombine edebilir ve gidişatı temiz tutmak için bir satır kod yapabiliriz:

```
people.push(Person(16, "Vitalik"));
```

`array.push()`un sıralamanın **sonuna** birşey eklediğine dikkat edin, yani öğeler onlara ekleediğimiz sıradadır. Aşağıdaki örneğe bakın:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// sayılar şimdi [5, 10, 15]'e eşittir
```

# Teste koy

Hadi birşey yapan kendi createZombie fonksiyonumuzu yapalım!

1. Fonksiyon gövdesini doldurun böylece yeni bir `Zombie` oluşturur ve ona `zombies` sıralaması ekler. Yeni Zombi için `name` ve `dna` fonksiyon argümanlarından gelmelidir.
2. Gidişatı temiz tutmak için hadi bunu bir kod satırında yapalım. 
