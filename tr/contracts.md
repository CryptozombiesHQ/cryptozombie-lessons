---
title: "Sözleşmeler"
actions: ['checkAnswer', 'hints']
material: 
  editor:
    language: sol
    startingCode: |
      pragma solidity //1. Enter solidity version here

      //2. Create contract here
    answer: > 
      pragma solidity ^0.4.19;


      contract ZombieFactory {

      }
---

Mutlak temellerden başlayarak:

Katılık kodu ** özleşmeler ** 'de kapsüllenmiştir. Bir sözleşme, Ethereum uygulamalarının temel yapı taşıdır - tüm değişkenler ve işlevler bir sözleşmeye aittir ve bu, tüm projelerinizin başlangıç noktası olacaktır.

"Merhaba Dünya" adında boş bir sözleşme şöyle görünecektir:

```
contract MerhabaDunya {

}
```

## Sürüm Pragma

Tüm katılık kaynak kodu bir "sürüm pragma" ile başlamalıdır - Bu kodun kullanması gereken Solidity derleyicisinin sürümünün bir bildirimi. Bu, potansiyel olarak kodunuzu bozacak değişiklikler getiren gelecekteki derleyici sürümleriyle ilgili sorunları önlemek içindir.

Şu gibi görünür: 'pragma sağlamlık ^ 0.4.19;' (bu yazı yazıldığı andaki son sağlamlık versiyonu, 0.4.19).

Bir araya getirmek, burada çıplak kemiklerle başlama sözleşmesi - her yeni bir projeye başlarken yazacağınız ilk şey:

```
pragma solidity ^0.4.19;

contract MerhabaDunya {

}
```

# Şimdi bunu test edelim

Zombi ordumuzu yaratmaya başlamak için, `ZombieFactory` adlı bir temel sözleşme oluşturalım.

1. Sağdaki kutuda, sözleşmemizin katılık sürümü '0.4.19' u kullanmasını sağlayınız.

2. `ZombieFactory` adlı boş bir sözleşme oluşturun.

İşiniz bittiğinde, aşağıdaki "cevabı kontrol et" seçeneğini tıklayın. Sıkışırsanız, "ipuçlarını" tıklayabilirsiniz.
