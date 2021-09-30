---
title: Web3.js
actions: ['zaznacz odpowiedź', 'podpowiedź']
material:
  saveZombie: true
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: true
    answer: 1
---

Nasz kontrakt Solidity jest gotowy! Teraz musimy już tylko napisać frontend w JavaScripcie, który będzie wchodził w interakcje z naszym kontraktem.

Ethereum dostarcza biblotekę JavaScript o nazwie **_Web3.js_**.


W późniejszych lekcjach pokażemy jak publikować kontrakt oraz jak ustawić Web3.js. Narazie jednak zobaczmy jak wygląda przykładowy kod, który komunikuje się z kontraktem.
Nie przejmuj się jeśli nie wszystko jest dla Ciebie zrozumiałe.

```
// Oto jak możemy dostać się do kontraktu
var abi = /* abi wygenerowane przez kompilator */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* adres naszego kontraktu w Ethereum po opublikowaniu */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory` ma dostęp do publicznych funkcji naszego kontraktu oraz eventów

//  event listener do pobierania tekstu z inputu:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // wywołanie funkcji `createPseudoRandomZombie` w naszym kontrakcie:
  ZombieFactory.createPseudoRandomZombie(name)
})

// nasłuchiwanie na event `NewZombie`, oraz aktualizacja UI (interfejsu użytkownika)
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// weź dna Zombie i zaktualizuj zdjęcie
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // uzupełnij DNA zerami jeśli jest krótsze niż 16 znaków
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // pierwsze 2 cyfry odpowiadają za głowę. Mamy 7 różnych głów, więc % 7
    // aby pobrać numer o 0 - 6, później dodać  1 aby mieć  1 - 7. Mamy 7
    // plików zdjęć od "head1.png" do "head7.png", które pobieamy bazując 
    // na tym numerze:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    //  2 nactępne cyfry odpowiadają za oczy, 11 możliwości:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 możliwości podkoszulków:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // ostatnie 6 cyfr odpowiada za kolor. Używany jest CSS filter: hue-rotate
    // o 360 stopniach:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

Następnie JavaScript pobiera wygenerowaną powyżej wartość w `zombieDetails` i używa przeglądarkowej magii (używamy Vue.js) aby podmienić zdjęcia i filtry CSS. Zobaczysz ten kod w późniejszej lekcji.

# Zadanie do wykonania

Na przód - wpisz swoje imię w polu po prawej i zobacz jakiego zombie otrzymasz!

**Kiedy otrzymasz zombie, który Ci się podoba, kliknij "Następny Rozdział" poniżej, aby zapisać swojego zombie i ukończyć lekcje 1!**
