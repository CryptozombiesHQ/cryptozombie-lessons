---
title: Storage a Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Začni písať tu

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

            function _createZombie(string _name, uint _dna) private {
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

      contract ZombieFeeding is ZombieFactory {

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
        }

      }
---

V Solidity existujú dve miesta kde môžu premenné "sýdliť". Buď v trvalom dátovom úložisku kontraktu, tzv. `storage`, alebo v pamäti `memory`.

**_Storage_** referuje na premenné trvalo uložené na blockchaine. **_Memory_** premenné su dočasné, a sú vymazané medzi jednotlivými externými volaniami funkcii kontraktu. Môžeš o týchto dvoch typoch úložísk premýšlať podobne ako o hard disku a RAMke.

Vačsinou nebudeš nutne musieť používať tieto kľučové slova, pretože Solidity vie, ako s premennými zaobchádzať. Stavové premenné (premenné deklarované mimo funkcií) sú automaticky typu `storage` a sú zapísané na blockchain. Naopak, premenné deklarované vo vnútri funkcií sú automaticky typu `memory`. Ich hodnota bude zabudnutá keď bežiaca funkcia dobehne.

Existujú však prípady kedy budeš tieto kľučové slová ručne špecifikovať. Predovšetkým vtedy, keď budeš pracovať so **_štruktúrami_** a **_poliami_** v rámci funkcií:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Toto vyzerá jasne, no Solidity ohlási varovanie hovoriace o tom
    // že je potrebné explicitne špecifikovať typ premennej `storage` alebo `memory`

    // Túto premennú by si mal deklarovať s kľučovým slovom `storage`:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...v takom prípade `mySandwich` je ukazateľom na `sandwiches[_index]`
    // v trvalom úložisku kontraktu, a preto ... 
    mySandwich.status = "Eaten!";
    // ...tento riadok kódu by permanentne zmení hodnotu `sandwiches[_index]`
    // na blockchaine

    // Ak sa chceš však len kópiu, môžeš deklarovať premennú v pamäti pomocou `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...v takom prípade bude `anotherSandwich` len dočasnou
    // kópiou v pamäti, a preto ...
    anotherSandwich.status = "Eaten!";
    // ...len modifikuje dočasnu premennú, no nebude mať žiadny trvalý efekt
    // na dáta `sandwiches[_index + 1]` v blockchaine. Mohol by si ale spraviť toto:
    sandwiches[_index + 1] = anotherSandwich;
    // ...ak by si chcel skopírovať upravené data naspať na trvalé úložisko nablokchaine
  }
}
```
Ak ešte plne nerozumieš kedy použiť memory alebo storage, nemaj obavy. V priebehu tohoto tutoriálu ti povieme kedy použiť `storage` a kedy použiť `memory`. Solidity kompilátor ti taktiež bude pomáhať upozorneniami v prípade že je potrebné, aby si použil jedno z týchto dvoch kľučových slov. 

Zatiaľ ale stačí rozumieť tomu, že existujú prípady kedy potrebujeme premenným explicitne špecifikovať `storage` alebo `memory`!

# Vyskúšaj si to sám

Je čas na to, dať našim zombie schopnosť sa kŕmiť a násobiť!

Keď sa zombie kŕmi na iných formách života, jeho DNA sa skombinuje s DNA obete. Na základe tejto kombinácie vznikne nový zombie.

1. Vytvor funkciu pomenovanú `feedAndMultiply`. Bude brať dva parametre: `_zombieId` (typu `uint`) a `_targetDna` (tiež typu `uint`). Táto funkcia bude `public`.

2. Nechceme aby našeho zombie dával kŕmiť niekto iný! Takže najprv overíme vlastníctvo zombie. Pridaj `require` aby si zaručil že `msg.sender` je skutočne vlastník daného zombie (podobne ako sme použili `require` vo funkcii `createPseudoRandomZombie`).

 > Poznámka: Pretože náš kontrolór odpovedí je primitívny, očakáva, že `msg.sender` bude v `require` prvý. Ak poradie prehodíš, odpoveď bude vyhodnotená ako nesprávna. V praxi ale na poradí výrazov v `require` nezáleží, oboje verzie sú správne.

3. Budeme potrebovať DNA tohoto zombie. Ďalšia vec, ktorú preto musí kontrakt vykonať je lokálna deklarácia premennej typu `Zombie` pomenovaná `myZombie` (a bude `storage` ukazaťeľom). Nastav hodnotu tejto premennej rovnú indexu `_zombieId` v našom `zombies` poli.

Mali by to byť 4 riadky kódu, včetne uzatváracej závorky `}`. 

V dalšej kapitole budeme ďalej rozvíjať túto funkciu!
