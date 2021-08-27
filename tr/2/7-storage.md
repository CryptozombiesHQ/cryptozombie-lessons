---
title: Depolama vs Hafıza
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Buradan başla

        }
      "zombiefactory.sol": |
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

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string _name, uint _dna) private {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.19;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

Solidity'de, değişkenleri depolayacağınız iki yer vardır — `storage` ve `memory`.

**_Depolama_** değişkenlerin kalıcı olarak blok zincirinde depolanmasını işaret eder. **_Hafıza_** değişkenleri geçicidir ve kontratınızı çağıran harici fonksiyon arasında silinir. Bilgisayarınızın hard diski ve RAM'i gibi düşünün.

Çoğu zaman Solidity onları varsayılan olarak işlediğinden bu anahtar kelimeleri kullanmanız gerekmez. Durum değişkenleri (fonksiyonların dışında tanımlanmış) fonksiyonların içinde belirlenen değişkenler `memory` iken ve fonksiyon bitir çağırdığında gözden kaybolacakken varsayılan `storage` ve kalıcı olarak blok zincirine yazılır.

Ancak, **_yapılar_** ve **_sıralar_** ile fonksiyon içine yaklaşım zamanı olarak adlandırılan bu anahtarlara ihtiyacınız olmadığında süreler vardır.:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Oldukça anlaşılır görünüyor, fakat solidity `storage` veya `memory`'i 
    // burada açıkça belirlemeniz gerektiği söyleyen bir uyarı verecek.
 
    // Yani bunun yerine, `storage` anahtar kelimesi ile belirlemelisiniz, şöyle:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...hangi durumlarda `mySandwich` bir `sandwiches[_index]` işaretçisidir
    // depolamada, ve...
    mySandwich.status = "Eaten!";
    // ...bu kalıcı olarak blok zincirinde `sandwiches[_index]`'i değiştirecek.

    // Sadece bir kopya istiyorsanız, `memory` kullanabilirsiniz:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...hangi durumlarda `anotherSandwich` basitçe hafızadaki verinin bir 
    // kopyası olacak, ve...
    anotherSandwich.status = "Eaten!";
    // ...geçici değişkeni değiştirecek ve `sandwiches[_index + 1]`'i 
    // etkilemeyecek. Fakat bunu yapabilirsiniz:
    sandwiches[_index + 1] = anotherSandwich;
    // ...değişiklikleri blok zinciri deposuna geri kopyalamak isterseniz.
  }
}
```

Hangisini ne zaman kullanacağınızı henüz tam anlamadıysanız endişelenmeyin — bu eğitim boyunca `storage` ve `memory`'nin ne zaman kullanılacağını size anlatacağız, ve Solidity derleyicisi ayrıca sizi bilgilendirmek için bu anahtar kelimelerden birini kullanmanız gerektiğinde size uyarılar verecek.

Şimdilik, `storage` veya `memory`'de açıkla belirlemeniz gerekecek durumlar olduğunu anlamanız yeterli !

# Teste koy

Zombilerimize beslenme ve çoğalma yeteneğiverme zamanı!

Bir zom bir başka bir yaşam formunda beslendiğinde, DNA'sı yeni bir zombi oluşturmak için diğer yaşam formunun DNA'sı ile birleşecek.

1. `feedAndMultiply`. denilen bir fonksiyon oluşturun. İki parametre alacaktır: `_zombieId` (bir `uint`) ve `_targetDna` (ayrı bir `uint`). Bu fonksiyon `public` olmalıdır.

2. Başka birinin zombimizi kullanıp beslemesine izin vermek istemiyoruz! O zaman ilk olarak, bu zombiye sahip olduğumuzdan emin olalım. `msg.sender`'in bu zombinin sahibine eşit olduğundan emin olmak için bir `require` durumu ekleyin (`createPseudoRandomZombie` fonksiyonunda yaptığımızla aynı).

 > Not: Tekrar, cevap denetleyicimiz primitif olduğundan, ilk gelmesi için `msg.sender` çıkarıyor ve sırayı değiştirirseniz onu yanlış işaretleyecek. Ama normalde kodlarken, istediğiniz bir tercih sırasını kullanabilirsiniz — ikisi de doğru.

3. Bu zombinin DNA'sını almamız gerekecek. Yani fonksiyonumuzun yapması gerek sonki şey `myZombie` isimli yerel bir `Zombie` belirlemek (bir `storage` işaretçisi olacak). Bu değişkeni `zombies` sıralamamızda indeks `_zombieId`'ye eşit olarak ayarlayın.

Kapatma satırları dahil, şimdiye kadar 4 satır kodunuz olmalı `}`. 

Sonraki bölümde bu fonksiyonu ayrıntılarıyla anlatmaya devam edeceğiz!
