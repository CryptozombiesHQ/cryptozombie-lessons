---
title: DNA Zombi
actions: ['checkAnswer', 'hints']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // inizia qui
          }

        }
      "zombiefactory.sol": |
        pragma solidity ^0.4.25;

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
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity ^0.4.25;

      import "./zombiefactory.sol";

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

Finiamo di scrivere la funzione `feedAndMultiply`.

La formula per calcolare il DNA di un nuovo zombi è semplice: è semplicemente la media tra il DNA dello zombi che si è nutrito ed il DNA del bersaglio. 

For example:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ sarà uguale a 3333333333333333
}
```

Successivamente possiamo rendere la nostra formula più complicata, se vogliamo, aggiungendo un po 'di casualità al DNA del nuovo zombi. Ma per ora lo terremo semplice — possiamo sempre tornarci più tardi.

# Facciamo una prova

1. Innanzitutto dobbiamo assicurarci che `_targetDna` non sia più lungo di 16 cifre. Per fare questo, possiamo impostare `_targetDna` uguale a `_targetDna% dnaModulus` per prendere solo le ultime 16 cifre.

2. Successivamente la nostra funzione dovrebbe dichiarare un `uint` chiamato `newDna` ed impostarlo uguale alla media del DNA di `myZombie` e di `_targetDna` (come nell'esempio sopra).

> Nota: è possibile accedere alle proprietà di `myZombie` usando `myZombie.name` e `myZombie.dna`.

3. Una volta che abbiamo il nuovo DNA, chiamiamo `_createZombie`. Puoi guardare la scheda `zombiefactory.sol` se dimentichi quali parametri questa funzione deve chiamare. Nota che richiede un nome, quindi impostiamo il nome del nostro nuovo zombi su `"NoName"` per ora — possiamo scrivere una funzione per cambiare i nomi degli zombi in un secondo momento.

> Nota: per gli esperti di Solidity, potresti aver notato un problema con il nostro codice! Non preoccuparti, lo sistemeremo nel prossimo capitolo;)
