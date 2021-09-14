---
title: Web3.js
actions:
  - 'sprawdźOdpowiedź'
  - 'podpowiedź'
material:
  saveZombie: prawda
  zombieResult:
    zombie:
      lesson: 1
    hideSliders: prawda
    answer: 1
---

Our Solidity contract is complete! Now we need to write a JavaScript frontend that interacts with the contract.

Ethereum has a JavaScript library called ***Web3.js***.

W późniejszych lekcjach, zagłębimy się w temat wdrażania kontraktu i ustawienia Web3.js. Lecz na tą chwile, spójrz na przykład kodu, jak Web3.js oddziaływuje na nasz wdrożony już kontrakt.

Nie martw sie, jeżeli nie ma to dla Ciebie narazie żadnego sensu.

    // Tu mamy pokazane jak uzyskać dostęp do kontraktu:
    var abi = /* abi wygenerowane przez kompilator */
    var ZombieFactoryContract = web3.eth.contract(abi)
    var contractAddress = /* adres naszego kontraktu w sieci Ethereum po wdrożeniu */
    var ZombieFactory = ZombieFactoryContract.at(contractAddress)
    // `ZombieFactory` ma dostęp do publicznych funkcji oraz eventów
    
    // Rodzaj nasłuchiwania eventu, który odbiera daną wejściową:
    $("#ourButton").click(function(e) {
      var name = $("#nameInput").val()
      // wywołaj funkcję kontraktu `createRandomZombie`:
      ZombieFactory.createRandomZombie(name)
    })
    
    // Nasłuchuj eventu `NewZombie` i zaktualizuj UI
    var event = ZombieFactory.NewZombie(function(error, result) {
      if (error) return
      generateZombie(result.zombieId, result.name, result.dna)
    })
    
    // Odbierz DNA Zombi i zaktualizuj obrazek
    function generateZombie(id, name, dna) {
      let dnaStr = String(dna)
      // wypełnij DNA zerami na początku, jeśli jest ono krótsze niż 16 znaków
      while (dnaStr.length < 16)
        dnaStr = "0" + dnaStr
    
      let zombieDetails = {
        // Dwie pierwsze cyfry tworzą głowę Zombiaka. Mamy 7 możliwych głów, więc % 7
        // aby otrzymać numer od 0 - 6, następnie dodajemy 1 aby uzyskać 1 - 7. Wtedy otrzymujemy 7
        // plików z obrazkami nazwanych odpowiednio "head1.png" do "head7.png" załadowujemy opierając się 
        // na tej liczbie:
        headChoice: dnaStr.substring(0, 2) % 7 + 1,
        // druga para, złożóna z 2-óch cyfr tworzy oczy, 11 modyfikacji:
        eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
        // 6 modyfikacji koszuli:
        shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
        // ostatnie 6 cyfr wpływa na kolor. Aktualizacja przy użyciu filtra CSS: hue-rotate
        // który ma 360 stopni:
        skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
        eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
        clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
        zombieName: name,
        zombieDescription: "A Level 1 CryptoZombie",
      }
      return zombieDetails
    }
    

What our JavaScript then does is take the values generated in `zombieDetails` above, and use some browser-based JavaScript magic (we're using Vue.js) to swap out the images and apply CSS filters. Otrzymasz do tego cały kod w późniejszej lekcji.

# Spróbuj!

Śmiało — wpisz nazwę w polu po prawej stronie i zobacz, jakiego Zombiaka otrzymasz!

**Jeśli masz juz Zombi, z którego jestes zadowolony to kliknij "Następny Rozdział" poniżej, aby zapisać swojego Zombi i ukończyć pierwszą lekcję!**