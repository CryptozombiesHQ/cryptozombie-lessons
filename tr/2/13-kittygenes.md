---
title: "Bonus: Kitty Genes"
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Modify function definition here:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Add an if statement here
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // And modify function call here:
            feedAndMultiply(_zombieId, kittyDna);
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
                randDna = randDna - randDna % 100;
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

        function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          if (keccak256(_species) == keccak256("kitty")) {
            newDna = newDna - newDna % 100 + 99;
          }
          _createZombie("NoName", newDna);
        }

        function feedOnKitty(uint _zombieId, uint _kittyId) public {
          uint kittyDna;
          (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
          feedAndMultiply(_zombieId, kittyDna, "kitty");
        }

      }
---

Fonksiyon mantığımız şimdi tamam... fakat bir bonus özellik daha ekleyelim.

Onu, kittie'lerden yapılan zombilerin cat-zombieler olduğunu gösteren bir benzersiz özelliğe sahip olacak şekilde yapalım.

Bunu yapmak için, zombinin DNA'sına özel bir kitty kodu ekleyebiliriz.

Ders 1'den hatırlarsanız, şu anda zombi görünümünü belirlemek için 16 haneli DNA'mızın ilk 12 basamağını kullanıyoruz. O halde "özel" karakterleri kullanmak için kullanılmayan son 2 basamağı kullanalım.

Cat-zombielerin DNA'sının son iki basamağının `99` olduğunu farz edeceğiz. (kedilerin 9 canı olduğundan). Yani kodumuzda, bir zombi bir kediden geliyorsa `if`, o zaman DNA'nın son iki basamağını `99` diyeceğiz.

## If ifadeleri

Solidity'de if ifadeleri javascriptteki gibidir:

```
function eatBLT(string sandwich) public {
  // Remember with strings, we have to compare their keccak256 hashes
  // to check equality
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# Teste koy

Hadi zombi kodumuzdaki kedi genlerini uygulayalım.

1. Öncelikle, `feedAndMultiply` için fonksiyon tanımını değiştirelim böylece o 3. bir argüman alır: `_species` isimli bir `string` 

2. Daha sonra, yeni zombinin DNA'sını hesapladıktan sonra, `_species`'in `keccak256` hashlerini ve `"kitty"` dizisini karşılaştıran bir `if` ifadesi ekleyelim

3. `if` ifadesinin içinde, DNA'nın son iki basamağını `99` ile değiştirmek istiyoruz. Bunu yapmanın bir yolu mantık kullanmak: `newDna = newDna - newDna % 100 + 99;`.

  > Açıklama: Varsayalım `newDna` `334455`'tir. O zaman `newDna % 100` `55`'tir, yani `newDna - newDna % 100` `334400`'dır. Son olarak  `334499` almak için `99` ekleyin.

4. Son olarak, `feedOnKitty` içinde fonksiyon çağrımını değiştirmemiz gerekiyor. `feedAndMultiply`'i çağırdığında, sonlandırmak için `"kitty"` parametresi ekler.
