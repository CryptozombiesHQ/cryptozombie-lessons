---
title: Zombiler Ne Yer?
actions: ['cevapKontrol', 'ipuçları']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Burada KittyInterface oluştur

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
          }

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

            function _createZombie(string _name, uint _dna) internal {
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

      contract KittyInterface {
        function getKitty(uint256 _id) external view returns (
          bool isGestating,
          bool isReady,
          uint256 cooldownIndex,
          uint256 nextActionAt,
          uint256 siringWithId,
          uint256 birthTime,
          uint256 matronId,
          uint256 sireId,
          uint256 generation,
          uint256 genes
        );
      }

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Zombilerimizi besleme zamanı! Ve zombilerimiz en fazla ne yemeyi sever?

Peki bu sadece CryptoZombie'lerin yemeyi sevmesi olur...

**CryptoKitties!** 😱😱😱

(Evet, Ciddiyim 😆 )

Bunu yapmak için CryptoKitties akıllı kontratından kittyDna'yı okumamız gerekecek. CryptoKitties verileri blok zincirinde açık olarak depolandığından bunu yapabiliriz. Blok zinciri çok iyi değil mi?!

Endişelenme — oyunumuz aslında herhangi birinin CryptoKitty'sine zarar vermeyecek. Biz sadece CryptoKitties vereilerini *okuyoruz*, aslında onu silemeyiz 😉

## Diğer kontratlarla etkileşime girmek

Blok zincirinde sahip olmadığımız başka bir kontratla kontratımızın görüşmesi için, ilk olarak bir **_arayüz_** belirlememiz gerek.

Bir basit örneği inceleyelim. Blok zincirinde bunun gibi bir kontratın olduğunu farz edelim:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Bu, herhangi birinin şanslı numarasını depolayabileceği basit bir kontrat olurdu ve onların Ethereum adresleriyle ilişkili olacaktı. Daha sonra başka biri onların adresini kullanarak kişinin şanslı numarasını arayabilirdi.

Şimdi `getNum` fonksiyonunu kullanarak bu kontratta verileri okumak istediğimiz harici bir kontrat yaptığımızı farz edelim.

İlk olarak `LuckyNumber` kontratın bir **_arayüzünü_** tanımlamamız gerekirdi:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Bunun birkaç değişiklik ile bir kontrat tanımlıyor gibi göründüğüne dikkat edin. For one, Bilhassa, sadece etkileşime sokacağımız fonksiyonları bildiriyoruz — bu durumda `getNum` — ve diğer fonksyonların herhangi birinden ve durum değişkenlerinden söz etmiyoruz.

İkinci olarak, fonksiyon gövdesini tanımlamıyoruz. Kıvırcık parantez yerine (`{` ve `}`), fonksiyon tanımını basitçe bir noktalı virgül (`;`) ile bitiriyoruz.
 
Yani bir tür kontrat iskeleti gibi görünüyor. Bu, derleyicinin onun bir arayüz olduğunu nasıl tanıyacağıdır.

Bu arayüzü dapp's kodumuza ekleyerek our kontratımız diğer kontratın fonksiyonunun ne gibi gözüktüğünü, onları nasıl çağıracağını, beklemek için yanıt türünü bilir.

Aslında diğer kontratın fonksiyonlarını çağırmayı diğer derste öğreneceğiz fakat şimdilik CryptoKitties kontratı için arayüzümüzü bildirelim.

# Teste koy

CryptoKitties kaynak kodunu sizin için araştırdık ve "genler" (zombi oyunumuzun yeni bir zombi oluşturmak için ihtiyacı olan şey!) dahil tüm kitty'nin verilerini getiren `getKitty` denilen bir fonksiyon bulduk.

Fonksiyon şunun gibi gözüküyor:

```
function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
) {
    Kitty storage kit = kitties[_id];

    // if this variable is 0 then it's not gestating
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

Fonksiyon alışık olduğumuzdan biraz farklı gözüküyor. Bir grup farklı değer getirdiğini... görebilirsiniz. JavaScript gibi bir programlama dilinden geliyorsanız, bu farklıdır — Solidity'de bir fonksiyondan birden fazla değer getirebilirsiniz.

Şimdi bu foksiyonun nasıl göründüğünü biliyoruz, onu bir arayüz oluşturmak için kullanabiliriz:

1. `KittyInterface` denilen bir arayüz belirleyin. Hatırla, bu yeni bir kontrat oluşturmak gibidir — `contract` anahtar kelimesini kullanırız.

2. Arayüz içinde, `getKitty` fonksiyonu tanımlayın (kıvırcık parantezler içindeki herşeyin yerine, yukardaki fonksiyonun bir kopyala/yapıştırı olan fakat  `returns` ifadesinden sonra bir noktalı virgül ile. 
