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

            function _generateRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
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

V Solidity existujú dve miesta kde môžu premenne "sýdliť". Buď v trvalom dátovom úložisku kontraktu - `storage`, alebo v pamäti - `memory`.
In Solidity, there are two places you can store variables — in `storage` and in `memory`.

**_Storage_** referuje na premenné trvalo uložené na blockchain.  **_Memory_** premenné su dočasné a su vymazáne medzi jednotlivý externými volaniami funkcii kontraktu. Môžeš o týchto dvoch typoch úložísk premýšlať podobne ako o hard disku a RAMke.
**_Storage_** refers to variables stored permanently on the blockchain. **_Memory_** variables are temporary, and are erased between external function calls to your contract. Think of it like your computer's hard disk vs RAM.

Vačsinou nebudeš nutne musieť používať tieto kľučové slova, pretože Solidity vie ako s premnnými vhodne zaobchádzať. Stavové premenné (premenné deklarované mimo funkcií) sú automaticky typu `storage` a su zapísané do blockchain. Naopak, premenné deklarované vo vnútri funkcii su automaticky typu `memory` a ich hodnota bude zabudnutá ked volaná funkcia dobehne.
Most of the time you don't need to use these keywords because Solidity handles them by default. State variables (variables declared outside of functions) are by default `storage` and written permanently to the blockchain, while variables declared inside functions are `memory` and will disappear when the function call ends.

Každopádne však existujú prípady, kedy budeš tieto kľučove slová ručne špecifikovať. Predovšetkým keď budeš pracovať so **_štruktúrami_** a **_poliami_** v rámci funkcií:
However, there are times when you do need to use these keywords, namely when dealing with **_structs_** and **_arrays_** within functions:

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
    // že je potreba explicitne špecifikovať typ premenne `storage` alebo `memory`

    // Takže by si mal deklarovať túto premennú s kľucovým slovom `storage`:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...v takom prípade `mySandwich` je len ukazateľom na `sandwiches[_index]`
    // v trvalom úložisku kontraktu, a preto ... 
    mySandwich.status = "Eaten!";
    // ...tento riadok kódu by permanentne zmenil hodnotu `sandwiches[_index]`
    // na blockchain

    // Ak sa chceš však len kópiu, môžeš použiť `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...a v takom prípade bude `anotherSandwich` proste len dočasnou
    // kópiou v pamäti, a preto ...
    anotherSandwich.status = "Eaten!";
    // ...iba modifikuje dočasnu premennú, no nebude mať žiadny efekt
    // na dáta v blockchain `sandwiches[_index + 1]`. No mohol by si spraviť toto:
    sandwiches[_index + 1] = anotherSandwich;
    // ...ak by si chcel skopírovať upravené data naspať na úložisko v blokchain
  }
}
```
Nemaj obavy ak ešte plne nerozumieš kedy použiť memory alebo storage - v priebehu tohoto tutoriálu ti povieme kedy použiť `storage` a kedy použiť `memory`. Solidity kompilátor ti taktiež bude pomáhať upozrneniami, v prípade že je potrebné aby si použil jedno z týchto dvoch kľučových slov. 
Don't worry if you don't fully understand when to use which one yet — throughout this tutorial we'll tell you when to use `storage` and when to use `memory`, and the Solidity compiler will also give you warnings to let you know when you should be using one of these keywords.

Zatiaľ však stačí rozumieť tomu, že existujú prípady keď potrebujeme explicitne špecifikovat deklaráciu `storage` alebo `memory`!
For now, it's enough to understand that there are cases where you'll need to explicitly declare `storage` or `memory`!

# Vyskúšaj si to sám
# Put it to the test

Je čas na to dať našim zombie schopnosť sa kŕmiť a násobiť!
It's time to give our zombies the ability to feed and multiply!

Keď sa zombie kŕmi na iných formách života, jeho DNA sa skombinuje s DNA obete a na základe tejto kombinácie sa vytvorí nový zombie.
When a zombie feeds on some other lifeform, its DNA will combine with the other lifeform's DNA to create a new zombie.

1. Vytvor funkciu pomenovanú `feedAndMultiply`. Tá bude brať dva parametre: `_zombieId` (typu `uint`) and `_targetDna` (tiež typu `uint`). Táto funkcia bude `public`.
1. Create a function called `feedAndMultiply`. It will take two parameters: `_zombieId` (a `uint`) and `_targetDna` (also a `uint`). This function should be `public`.

2. Nechceme aby za nás kŕmil našeho zombie niekto iný! Takže najprv sa uistime, že tohoto zombie vlastníme. Pridaj `require` aby si zaručil že `msg.sender` je skutočne vlastník daného zombie (podobne ako sme použili `require` vo funkcii `createRandomZombie`).
2. We don't want to let someone else feed using our zombie! So first, let's make sure we own this zombie. Add a `require` statement to make sure `msg.sender` is equal to this zombie's owner (similar to how we did in the `createRandomZombie` function).

 > Poznámka: Opať raz, pretože náš kontrolór odpovedí je primitívny, očakáva že `msg.sender` bude v `require` prvý. Ak poradie prehodíš, odpoved bude vyhodnotená ako nesprávna. V praxi na poradí výrazov v `require` ale nezáleží, oboje verzie sú správne.
 > Note: Again, because our answer-checker is primitive, it's expecting `msg.sender` to come first and will mark it wrong if you switch the order. But normally when you're coding, you can use whichever order you prefer — both are correct.

3. Budeme potrebovať DNA tohoto zombie. Preto ďalšia vec, ktorú musí kontrakt vykonať je lokálna deklarácia premennej typu `Zombie` pomenovaná `myZombie` (a bude `storage` ukazaťeľom). Nastav hodnotu tejto premennej rovnú indexu `_zombieId` v našom `zombies` poli.
3. We're going to need to get this zombie's DNA. So the next thing our function should do is declare a local `Zombie` named `myZombie` (which will be a `storage` pointer). Set this variable to be equal to index `_zombieId` in our `zombies` array.

Mali by to byť 4 riadky kódu, včetne uzatváracej závorky `}`. 
You should have 4 lines of code so far, including the line with the closing `}`. 

V dalšej kapitole budeme ďalej rozvíjať túto funkciu!
We'll continue fleshing out this function in the next chapter!
