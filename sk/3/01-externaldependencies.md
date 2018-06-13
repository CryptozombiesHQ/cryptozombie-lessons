---
title: Nemennosť kontraktov
actions: ['checkAnswer', 'hints']
requireLogin: true
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

          // 1. Zmaž tento riadok
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Toto zmeň len na deklaráciu bez inicializácie
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Tu pridaj funkciu setKittyContractAddress

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

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
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

        KittyInterface kittyContract;

        function setKittyContractAddress(address _address) external {
          kittyContract = KittyInterface(_address);
        }

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

Doposiaľ Solidity vyzeralo celkom podobne ako ostatné programovanie jazyky, napríklad Javascript. Existuje však niekoľko veľkých rozdielov akými sa decentralizované aplikácie (DApps) na Ethereu líšia od klasických aplikácií.
Up until now, Solidity has looked quite similar to other languages like JavaScript.  But there are a number of ways that Ethereum DApps are actually quite different from normal applications.

Za prvé, po tom čo nasadíš svoj kontrakt na Ethereum blockchain, bude **_nemeniteľný_** , čo znamená že jeho kód už nikdy nemože byť upravený.
To start with, after you deploy a contract to Ethereum, it’s **_immutable_**, which means that it can never be modified or updated again.

Počiatočný kód kontraktu ktorý nasadíš na blockchain tam zostane navždy, permanentne. Práve to je ale jeden z dôvodov, prečo je bezpečnosť v prípade Solidity kontraktov extrémne dôležitá záležitosť.. Ak je v tvojom kód chyba, nie je spôsob ako ju neskôr napraviť. Musel by si povedať svojim užívateľom aby začali používať adresu iného smart kontraktu, ktorý by zahrňoval opravu danej chyby.
The initial code you deploy to a contract is there to stay, permanently, on the blockchain. This is one reason security is such a huge concern in Solidity.  If there's a flaw in your contract code, there's no way for you to patch it later. You would have to tell your users to start using a different smart contract address that has the fix.

No nemenitelnost je zároveň užitočnou vlastnosťou smart kontraktov. Kód je zákon. Ak si prečítaš kód smart kontraktu, môžeš si byť istý že vždy keď zavoláš jeho funkciu, vykoná sa presne to čo si našiel napísané v kóde. Nikto sa nemôže dodatočne rozhodnúť upraviť kód tej funkcie a spôsobiť neočakávané výsledky pre užívateľov.  
But this is also a feature of smart contracts. The code is law. If you read the code of a smart contract and verify it, you can be sure that every time you call a function it's going to do exactly what the code says it will do. No one can later change that function and give you unexpected results.

## Externé závislosti
## External dependencies

V Lekcii 2 sme zafixovali adresu CryptoKitties smart kontraktu do našej DApp. Ale čo by sa stalo, keby CryptoKitties kontrakt mal v sebe chybu a niekto zmazal všetky mačky?
In Lesson 2, we hard-coded the CryptoKitties contract address into our DApp.  But what would happen if the CryptoKitties contract had a bug and someone destroyed all the kitties?

Je to síce nepravdepodobné, ale keby sa to stalo, spravilo by to našu DAppku kompletne nepoužitelnú - naša DApp by odkazovala na kontrakt ktorý by už nevracal žiadne krypto mačky. Naši zombie by sa teda neboli schopný na mačkách kŕmiť a my by sme nemali možnosť náš kontrakt upraviť. 
It's unlikely, but if this did happen it would render our DApp completely useless — our DApp would point to a hardcoded address that no longer returned any kitties. Our zombies would be unable to feed on kitties, and we'd be unable to modify our contract to fix it.

Práve z tohoto dôvodu dáva zmysel vytvárať funkcie, ktoré umožnia aktualizovať kľučové časti našej DApp.
For this reason, it often makes sense to have functions that will allow you to update key portions of the DApp.

Napríklad, namiesto zafixovania adresy CryptoKitties kontraktu do našej DAppky, mohli sme si spraviť funkciu `setKittyContractAddress`, ktorá by nám umožnila zmeniť túto adresu. V prípade že by sa v budúcnosti stalo CryptoKitties kontraktu niečo zlé, mohli by sme aktualizovať adresu CryptoKitties kontraktu na novú opravenú verziu.
For example, instead of hard coding the CryptoKitties contract address into our DApp, we should probably have a `setKittyContractAddress` function that lets us change this address in the future in case something happens to the CryptoKitties contract.

# Vyskúšaj si to sám
## Put it to the test

Poďme upraviť náš kód z Lekcie 2, tak aby sme boli schopný modifikovať adresu CryptoKitties kontraktu.
Let's update our code from Lesson 2 to be able to change the CryptoKitties contract address.

1. Zmaž riadok kódu kde sme zafixovali hodnotu premennej `ckAddress`.
1. Delete the line of code where we hard-coded `ckAddress`.

2. Upravit riadok, v ktorom sme vytvorili `kittyContract`. Namiesto priradenia hodnoty túto premennú len deklaruj.
2. Change the line where we created `kittyContract` to just declare the variable — i.e. don't set it equal to anything.

3. Vytvor funkciu, ktorá sa bude volať `setKittyContractAddress`. Bude príjmať jeden argument `_address` (typu `address`). Mala by to byť `external` funkcia.
3. Create a function called `setKittyContractAddress`. It will take one argument, `_address` (an `address`), and it should be an `external` function.

4. Vo vnútri tejto funkcie pridaj riadok kódu, ktorý nastaví hodnotu `kittyContract` rovnú `KittyInterface(_address)`.
4. Inside the function, add one line of code that sets `kittyContract` equal to `KittyInterface(_address)`.

> Poznámka: Ak si všimneš bezpečnostnú zranitelnosť v tejto funkcii, neboj, opravíme to v ďalšej kapitole ;)
> Note: If you notice a security hole with this function, don't worry — we'll fix it in the next chapter ;)
