---
title: Storage vs Memory
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Start her

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

I Solidity,  er det to steder du kan lagre variabler — i `storage` og in `memory`.

**_Storage_** refererer til variabler lagret permanent på blockchain. **_Memory_** variabler er midlertidige, og slettes mellom eksterne funksjonssamtaler til kontrakten din. Tenk på det som datamaskinens harddisk vs RAM.

Mesteparten av tiden trenger du ikke å bruke disse nøkkelordene, fordi Solidity håndterer dem som standard. Status-variabler (variabler deklarert utenfor funksjoner) er som standard `storage` og skrevet permanent til blockchainen, mens variabler som er deklarert inne i funksjonene, er`memory` og vil forsvinne når funksjonsanropet avsluttes.

Men, det er noen ganger du faktisk trenger å bruke disse nøkkelordene, mest når vi håndterer **_structs_** og **_arrays_** inne i funksjoner:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Virker ganske grei, men solidity vil gi deg en advarsel som
    // forteller deg at du eksplisitt bør deklarere  `storage` eller `memory` her.

    // så istedet deklarer med `storage` nøkkelord slik:
    Sandwich storage mySandwich = sandwiches[_index];
    // ... i så fall `mySandwich` er en peker til `sandwiches[_index]`
    // i storage, og ...
    mySandwich.status = "Eaten!";
    // ... dette vil permanent endre `sandwiches[_index]` på blockchainen.

    // Hvis du bare vil ha en kopi, kan du bruke`memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ... i så fall er "anotherSandwich" rett og slett en kopi av
    // data i minnet, og ...
    anotherSandwich.status = "Eaten!";
    // ... vil bare endre den midlertidige variabelen og har ingen effekt
    // på `sandwiches[_index + 1]`. Men du kan gjøre dette:
    sandwiches[_index + 1] = anotherSandwich;
    // ... hvis du vil kopiere endringene tilbake i blockchain lagring(storage).
  }
}
```

Ikke bekymre deg hvis du ikke forstår fullt når du skal bruke hvilken av de - gjennom denne opplæringen forteller vi deg når du skal bruke `storage` og når du skal bruke `memory`, og Solidity-kompilatoren vil også gi deg advarsler for å gi deg beskjed når du skal bruke ett av disse nøkkelordene.

For nå er det nok å forstå at det er tilfeller der du må eksplisitt erklære `storage` eller `memory`!

# Test det

Det er på tide å gi våre zombier muligheten til å mate og formere seg!

Når en zombie feeds på et annet livsform, vil dets DNA kombinere med det andre livsformede DNA for å skape en ny zombie.

1. Lag en funksjon kalt `feedAndMultiply`. Den vil ta to parametere: `_zombieId` (en `uint`) og `_targetDna` (en `uint`). Denne funksjon skal være `public`.

2. Vi ønsker ikke å la noen andre mate med vår zombie! Så først, la oss sørge for at vi eier denne zombieen. Legg til en `require` statement for å være sikker at `msg.sender` er zombie-ens eier (likt som vi gjorde det i `createPseudoRandomZombie` funksjonen).

 > Noter: Igjen, fordi vår svar-kontroller er primitiv, forventer den `msg.sender` å komme først og vil markere feil hvis du bytter rekkefølgen. Men normalt når du er koder, kan du bruke hvilken rekkefølge du foretrekker - begge er riktige.

3. Vi kommer til å trenge å få denne zombieens DNA. Så det neste som vår funksjon skal gjøre er å erklære en lokal `Zombie` som heter `myZombie` (som vil være en `storage` peker). Sett denne variabelen til å være lik indeksen `_zombieId` i vår `zombies`-array.

Du bør ha 4 linjer med kode så langt, inkludert linjen med den avsluttende `}`.

Vi fortsetter å utvinne denne funksjonen i neste kapittel!
