---
title: Kısa Kesmek
actions: ['cevapKontrol', 'ipuçları']
material:
  saveZombie: true
  zombieBattle:
    zombie:
      lesson: 1
    humanBattle: false
    hideSliders: true
    answer: 1
---

İşte bu kadar, ders 2'yi tamamladınız!

Çalışmasını görmek için demoyu kontrol edebilirsiniz. Devam edin, Biliyorum bu sayfanın aşağısına kadar bekleyemiyorsunuz 😉. Saldırı için bir kitty'e tıklayın ve edindiğiniz yeni kitty zombieyi görün!

## JavaScript uygulaması

Bu kontratı Ethereum'a açmaya hazır olduğumuzda `ZombieFeeding`'i derleyip yayacağız — bu kontrat `ZombieFactory`'den kalan son kontratımız olduğundan ve her iki kontratta da tüm genel yöntemlere erişimi olduğundan.

JavaScript ve web3.js kullanarak yayılan kontratımızın bir etkileşim örneğine bakalım:

```
var abi = /* abi derleyici tarafından oluşturuldu */
var ZombieFeedingContract = web3.eth.contract(abi)
var contractAddress = /* dağıtımdan sonraki Ethereum'da kontrat adresimiz */ 
var ZombieFeeding = ZombieFeedingContract.at(contractAddress)

// Saldırmak istediğimiz zombi kimliğimiz ve kitty kimliğimiz olduğunu göz önünde tutuyoruz
let zombieId = 1;
let kittyId = 1;

// CryptoKitty'nin görüntüsünü almak için, onların web API'sini sorgulamamız gerek.
// Bu bilgi blok zincirinde depılanmaz, sadece web sunucularında.
// Herşey bir blok zincirinde depolanmışsa, zombi oyunumuzu beğenmezlerse 
// sunucunun çöküşünden, API'lerinin değiştirilmesinden yada varlıklarını 
// yüklemekten dolayı şirketin bizi engellemesinden endişelenmemeliyiz ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId
$.get(apiUrl, function(data) {
  let imgUrl = data.image_url
  // resmi görüntülemek için birşey yap
})

// Kullanıcı bir kitty'e tıkladığında:
$(".kittyImage").click(function(e) {
  // Kontratımızın `feedOnKitty` yöntemini çağır
  ZombieFeeding.feedOnKitty(zombieId, kittyId)
})

// Kontratımızdan bir NewZombie etkinliği için dinle yani onu görüntüleyebiliriz:
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // Bu fonksiyon ders 1'deki gibi zombiyi görüntüleyecek:
  generateZombie(result.zombieId, result.name, result.dna)
})
```

# Deneyin!

Beslemek istediğiniz kitty'i seçin. Zombinin DNA'sı ve kittynin DNA'sı birleşecek ve ordunuzda yeni bir zombiniz olacak!

Dikkat, bu sevimli kedi bacakları yeni zombizin mi? Bu çalışmada DNA'nın son `99` basamağımız 😉

İsterseniz başa dönebilir ve tekrar deneyebilirsiniz. Yeni bir kitty zombi edindiğinizde onunla mutlusunuzdur (sadece tutulan birini alırsınız), devam edin ve ders 2'yi tamamlamak için sonraki bölüme ilerleyin!
