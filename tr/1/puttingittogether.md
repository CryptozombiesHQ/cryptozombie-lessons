---
title: Bir Araya Getirmek
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
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

Rastgeler Zombi oluşturucumuzu bitirmeye yaklaştık! Herşeyi birbirine bağlayan genel bir fonksiyon oluşturalım.

Rastgele DNA'lı bir zombi oluşturmak için bir giriş, zombinin ismini alan ve ismi kullanan bir genel fonksiyon oluşturacağız. 

# Teste koy

1. `createPseudoRandomZombie` isimli bir `public` fonksiyon oluştur. `_name` (bir `string`) isimli bir parametre alacak. _(Not: Tıpkı önceki fonksiyonu `private` olarak ifade ettiğiniz gibi bu fonksiyonu `public` ifade edin)_

2. Fonksiyonun ilk satırı `_name` üzerinde `_generatePseudoRandomDna` fonksiyonunu çalıştırmalı ve `randDna` isimli bir `uint` içinde onu depolamalıdır.

3. İkinci satır `_createZombie` fonksiyonunu çalıştırmalı ve `_name` ve `randDna` vermeli.

4. Çözüm fonksiyon kodunun 4 satırı olmalı (kapanış dahil `}`.
