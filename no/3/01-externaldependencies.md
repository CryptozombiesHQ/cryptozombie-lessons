---
title: Uforanderlighet av kontrakter
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

          // 1. Fjern dette:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Endre dette til bare en deklarasjon:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Legg til setKittyContractAddress metoden her

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

Hittil har Solidity sett ganske lik ut som andre språk, som JavaScript. Men det er mange måter Ethereum DApps er forskjellig fra normale applikasjoner.

Til å begynne med, etter at du har distribuert en kontrakt til Ethereum, er den **_uforanderlig (Immutable)_**, noe som betyr at den aldri kan endres eller oppdateres igjen.

Den opprinnelige koden du distribuerer til en kontrakt er der for å være permanent, i blockchain-en. Dette er en av grunnene til at sikkerhet er en så stor bekymring i Solidity. Hvis det er feil i kontraktskoden din, er det ikke mulig å fikse det senere. Du må få brukerne til å begynne å bruke en annen smart-kontrakt adresse enn den som har feilen.

Men dette er også den positive delen av smarte kontrakter. Koden er lov. Hvis du leser koden for en smart kontrakt og verifiserer det, kan du være sikker på at hver gang du kjører en funksjon, gjør den akkurat hva koden sier den vil gjøre. Ingen kan senere endre den funksjonen og gi deg uventede resultater.

## External dependencies

I Leksjon 2 har vi hardkoddet CryptoKitties kontraktadressen til vår DApp. Men hva ville skje hvis CryptoKitties-kontrakten har en feil og noen ødelegger alle kattene?

Det er usannsynlig, men hvis dette skjer, vil det gjøre vår DApp helt ubrukelig - vår DApp ville peke på en hardkodet adresse som ikke lenger returnerer noen kitties. Våre zombier ville ikke kunne mate på kitties-ene, og vi ville ikke kunne endre kontrakten vår for å fikse det.

Av denne grunn er det ofte fornuftig å ha funksjoner som lar deg oppdatere viktige deler av DApp.

For eksempel, i stedet for hardkoding av CryptoKitties-kontraktadressen i vår DApp, bør vi sannsynligvis ha en `setKittyContractAddress`-funksjon som lar oss endre denne adressen i fremtiden hvis noe skjer med CryptoKitties-kontrakten.

## Test det

La oss oppdatere koden fra leksjon 2 for å kunne endre CryptoKitties kontraktadressen.

1. Slett linjen med kode hvor vi hardkodet `ckAddress`.

2. Endre linjen der vi opprettet `kittyContract` slik at vi bare deklarerer variablen — f.eks. ikke sett den lik til noen ting.

3. Lag en funksjon kalt `setKittyContractAddress`. Det vil ta ett argument, `_address` (en `address`),og det burde være en `external` funksjon.

4. Inne i funksjonen legger du til en linje med kode som setter `kittyContract` lik `KittyInterface(_address)`.

> Noter: Hvis du ser et sikkerhetshull med denne funksjonen, ikke vær redd - vi løser det i neste kapittel;)
