---
title: Yapılar ve Dizilerle Çalışma
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
              // buradan başlayın
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

### Yeni Yapılar Oluşturma

Önceki örnekte `Kişim 'yapısını hatırlıyor musun?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Şimdi yeni 'Kişiler' yaratmayı ve bunları 'insan' dizisine nasıl ekleyeceğimizi öğreneceğiz.

```
// Yeni Bir Kişi Yarat:
Person satoshi = Person(172, "Satoshi");

// Bu kişiyi Dizi'ye ekleyin:
people.push(satoshi);
```

Ayrıca, bunları bir araya getirip bunları temiz tutmak için bir satır kod halinde yapabiliriz:

```
people.push(Person(16, "Vitalik"));
```

`Array.push ()` dizinin ** ucuna ** bir şey eklediğine dikkat edin, böylece elemanlar sıralamıza eklenirler. Aşağıdaki örneğe bakın:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// numbers is now equal to [5, 10, 15]
```

# Şimdi bunu test edelim

createZombie fonksiyonumuzu yaratmak için bir şeyler yapalım!

1. İşlev gövdesini yeni bir "Zombie" oluşturacak şekilde doldurun ve onu `zombies` dizisine ekleyin. Yeni zombi için `isim 've' dna 'fonksiyon argümanlarından gelmelidir.
2. İşleri temiz tutmak için bir satır kodla yapalım.
