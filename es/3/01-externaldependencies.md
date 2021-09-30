---
title: Inmutabilidad de los Contratos
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.25;

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

          // 1. Eliminar esto:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Cambiar esto por únicamnete la declaración:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Añadir el método setKittyContractAddress aquí

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str));
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
      pragma solidity ^0.4.25;

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
          if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
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

Hasta ahora, Solidity se ha parecido bastante a otros lenguajes como JavaScript. Pero hay unas cuantas maneras en las que las DApps de Ethereum son diferentes a las aplicaciones normales.

Para empezar, despues de implementar un contrato en Ethereum, es **_inmutable_**, lo que significa que nunca va a ser modificado o actualizado de nuevo.

El código inicial que implementes en el contrato es el que va a permanecer, permanentemente, en la blockchain. Esto es debido a que una de las mayores preocupaciones de Solidity es la seguridad. Si hay un error en el código del contrato, no hay forma de solucionarlo más adelante. Tendrás que decirles a tus usuarios que empiecen a usar otra dirección de contrato inteligente que incluya ese arreglo.

Pero es también una característica de los contratos inteligentes. El código es la ley. Si lees el código de un contrato inteligente y lo verificas, vas a estar totalmente seguro de que cada vez que lo llames va a hacer exactamente lo que el código dice que va a hacer. Nadie va a poder más adelante cambiar la función y que te devuelva resultados inesperados.

## Dependencias externas

En la Lección 2, hardcodeamos la dirección del contrato de CryptoKitties en nuestra DApp. Pero ¿qué pasa si el contrato de CryptoKitties tiene un error y alguien destruye todos los gatitos?

Es improbable, pero si esto pasase dejaría nuestra DApp completamente inservible - nuestra DApp apuntará a una dirección hardcodeada que no devolverá gatitos nunca más. Nuestros zombis no podrán alimentarse de gatitos, y no podremos modificar nuestro contrato para solucionarlo.

Por este motivo, a veces tiene sentido programar funciones que te permitan actualizar partes de nuestra DApp.

Por ejemplo, en vez de hardcodear la dirección del contrato de CryptoKitties en nuestra DApp, probablemente deberíamos tener una función `setKittyContractAddress` que nos deje cambiar esta dirección en el futuro en caso de que algo ocurra con el contrato de CryptoKitties.

## Vamos a probarlo

Vamos a actualizar nuestro código de la Lección 2 para que sea capaz de cambiar la dirección del contrato de CryptoKitties.

1. Borra la línea hardcodeada donde definíamos `ckAddress`.

2. Cambia la línea donde creamos el `kittyContract` y únicamente declara la variable —  es decir, no la inicializes a nada.

3. Crea una función llamada `setKittyContractAddress`. Esta recibirá un argumento, `_address` (un `address`), y deberá ser una función `external`.

4. Dentro de la función, añade una línea de código que inicialize `kittyContract` a `KittyInterface(_address)`.

> Nota: Si notas un agujero de seguridad en esta función, no te preocupes - lo arreglaremos en el próximo capítulo ;)
