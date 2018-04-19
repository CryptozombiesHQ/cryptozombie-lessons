---
title: Ders Genel Bakış
actions: ['cevapKontrol', 'ipuçları']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Ders 1'de, bir zombi ordusu yapmak için bir "Zombi Fabrikası" inşa etmeyi öğreneceksiniz.

* Fabrikamız ordumuzun içindeki tüm zombilerin bir veritabanını sürdürecek  
* Fabrikamızın yeni zombiler oluşturmak için bir fonksiyonu olacak  
* Her zombinin rastgele ve benzersiz bir görünümü olacak  

Sonraki derslerde, insanlara veya diğer zombilere saldırması için zombilere yetenek vermek gibi daha fazla işlevsellik ekleyeceğiz! Fakat oraya gitmeden önce, yeni zombiler oluşturmanın temel işlevselliğini eklememiz lazım.
  
## Zombi DNA'sı Nasıl Çalışıyor?

Zombinin görünümü "Zombi DNA"sına bağlı olacak. Zombi DNA'sı basittir - şunun gibi 16 basamaklık bir sayıdır:
 
```
8356281049284737
```

Tıpkı gerçek DNA gibi, bu sayının farklı kısımları farklı karakterleri planlayacak. İlk 2 basamak zombinin kafa tipini, ikinci 2 basamak zombinin gözlerini vs. planlar.

> Not: Bu eğitim için, olayları basit tuttuk ve zombilerimiz sadece 7 tip kafaya sahip olabilir (2 basamak 100 olası seçeneğe izin verse de). Zombi çeşitlilik sayısını arttırmayı isteseydik devamında daha fazla kafa tipi ekleyebilirdik.
 
Örneğin, yukarıdaki örnek DNA'mızın ilk 2 basamağı `83`tür. Bunu zombinin kafa tipine planlamak için, `83 % 7 + 1` = 7 yaparız. Yani bu Zombi 7. kafa tipine sahip olur.

Sağdaki panelde, ilerleyin ve 'kafa geni' kaydırıcısını 7. kafaya (Santa şapkası) hareket ettirerek `83`ün hangi karaktere karşılık geldiğini görün.

# Teste koy

1. Sayfanın sağ tarafındaki kaydırıcı ile oynayın. Farklı sayısal değerlerin zombi görünümünün farklı yönlerine nasıl karşılık geldiğini görmek için denemeler yapın.

Tamam, etrafında oynamak yeterli. Devam etmek için hazır olduğunda, aşağıdan "Sonraki Bölüm"ü bul ve Solidity öğrenmenin içine dalalım!
