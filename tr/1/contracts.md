---
title: "Kontratlar"
actions: ['cevapKontrol', 'ipuçları']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Solidity sürümünü buraya gir

      //2. Burada kontrat oluştur
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Mutlak temeller ile başlangıç:

Solidity'nin kodu **kontratlar**da kapsüllendi. Bir `contract` Ethereum uygulamalarının esas yapı taşıdır - bir kontrata ait tüm değişkenler ve fonksiyonlar, ve bu tüm projelerinizin başlangıç noktası olacak.

`HelloWorld` isimli boş bir kontrat şunun gibi gözükür:

```
contract HelloWorld {

}
```

## Pragma Sürümü
  
Tüm solidity kaynak kodları bir "pragma sürümü" ile başlamalı — Solidity derleyici bu kod sürümünün bir beyanı kullanılmalı. Bu, potansiyel olarak kodunuzu bozacak değişiklikler getiren gelecekteki derleyici sürümleriyle ilgili sorunları önlemek içindir.

Böyle görünüyor: `pragma solidity ^0.4.19;` (bu yazının yazıldığı tarihte solidiynin son sürümü için, 0.4.19).

Bir araya getiriliyor, burada sade başlangıç kontratı var — ilk şey yeni bir projeye başladığın her zamanı yazacaksın:

```
pragma solidity ^0.4.19;

contract HelloWorld {

}
```

# Teste koy

Zombi ordumuzu oluşturmaya başlamak için, hadi `ZombieFactory` denilen bir temel kontrat oluşturalım.

1. Sağdaki kutuda, kontratımız '0.4.19' solidity sürümünü kullanıyor yapın.

2. `ZombieFactory` denilen boş bir kontrat oluşturun.

Bitirdiğinizde, aşağıda "cevabı kontrol et"e tıklayın. Takılırsanız "ipucu"na tıklayabilirsiniz.
