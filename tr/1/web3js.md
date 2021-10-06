---
title: Web3.js
actions: ['cevapKontrol', 'ipuçları']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

Solidity kontratımız tamamlandı! Şimdi kontrat ile etkileşen bir JavaScript ön yüzü yazmamız gerek.

Ethereum **_Web3.js_** denilen bir JavaScript kütüphanesine sahip.

Sonraki bir derste, bir kontratın nasıl dağıtılacağının ve Web3.js kurulumunun derinlerine ineceğiz. Fakat şimdilik, Web3.js'nin sevk edilmiş kontratla nasıl etkileşeceğine ilişkin bazı örnek kodlara bakalım.

Bunun hepsi mantıklı gelmezse yine de endişelenmeyin.

```
// Kontratımıza nasıl erişileceği aşağıda açıklanmıştır:
var abi = /* abi derleyici tarafından oluşturuldu */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* deployingden önce Ethereum'daki kontrat adresimiz */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory`nin kontratlarımızın genel fonksiyonlarına ve etkinliklere erişimi var

// metin girişi almak için etkinlik dinleyicilerinin bir sırası:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // Call our contract's `createPseudoRandomZombie` function:
  ZombieFactory.createPseudoRandomZombie(name)
})

// `NewZombie` etkinliği için dinle ve kullanıcı arayüzünü güncelle
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// Zombi dnası al ve görüntümüzü güncelle
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // 16 karakterin altındaysa baştaki sıfırları olan pad DNA
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // ilk iki basamak kafayı oluşturur. 7 olası kafamız var, yani % 7
    // 0-6 arasında bir sayı almak için, o zaman 1-7 yapmak için 1 ekle, 7'miz var
    // "head1.png" isimli "head7.png"ye kadar dayanan görüntü dosyaları
    // bu sayı:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2. 2 basamak gözleri oluşturur, 11 varyasyon:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 gömlek varyasyonu:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // son 6 basamak rengi kontrol eder. CSS filtre kullanılarak güncellendi: hue-rotate
    // which has 360 degrees:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "Bir Seviye 1 CryptoZombie",
  }
  return zombieDetails
}
```

Java scriptimiz daha sonra ne yaparsa yukarıdaki `zombieDetails` içinde oluşturulan değerleri alır ve görüntüleri götürmek için bir tarayıcı merkezli JavaScript sihirbazı (biz Vue.js kullanıyoruz) kullanır ve CSS filtreleri uygular. Sonraki derslerde bunun için tüm kodları alacaksınız.

# Bir şans ver!

Devam et — sağdaki kutucuğa ismini yaz ve ne tür zombi aldığına bak!

**Bir zombiniz olur olmaz mutlusunuz, ilerleyin ve zombinizi kaydetmek ve ders 1'i tamamlamak için aşağıdan "Sonraki Bölüm"e tıklayın!**
