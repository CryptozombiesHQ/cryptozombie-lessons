---
titulo: Inmutabilidad de Contratos
acciones: ['checkAnswer', 'hints']
requiereSesión: true
material:
  editor:
    lenguaje: sol
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

          // 1. Elimina esto:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Cambia esto a una declaración:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Añade el metodo setKittyContractAddress aquí

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

Hasta ahora, Solidity ha sido muy similar a otros lenguajes como JavaScript. Pero hay muchos modos en los que las DApps de Ethereum son realmente muy diferentes de las aplicaciones normales.

Para empezar, luego de desplegar un contrato a Ethereum, es **_inalterable_**, lo cual quiere decir que mas nunca puede ser actualizado o modificado.

El codigo inicial implementado en un contrato está ahi para quedarse, permanentemente, en la blockchain. Por esta razón, la seguridad es una gran preocupación en Solidity. Si existe una falla en el código de tu contrato, no hay manera de repararla después. Tendrás que decirle a los usuarios para que comiencen a usar una dirección de contrato distinta que tenga la reparación.

Pero esta tambien es una característica de los contratos inteligentes. El código es ley. Si lees el codigo de un contrato inteligente y lo verificas, puedes estar seguro de que cada vez que llames a una función, esta hara exactamente lo que el código dice que debe hacer. Nadie puede cambiar esa función en el futuro para darle resultados inesperados.

## Dependencias externas

En la lección 2, hemos codificado las direcciones de los contratos de los Cryptokitties en nuestra DApp. Pero que pasaría si los contratos de los Cryptokitties tienen un error y alguien destruye todos los kitties?

No es posible, pero si esto pasa, haría nuestra DApp completamente — nuestra DApp señalaría a una dirección codificada que ya no devuelve kitties. Nuestros zombies serían incapaces de alimentarse, y no podríamos modificar nuestro contrato para repararlo.

Por esta razón, a veces tiene sentido el tener funciones que te permitirían actualizar porciones del código de la DApp.

Por ejemplo, en vez de codificar las direcciones de los contratos de los CryptoKitties en nuestra DApp, deberíamos tener una función `setKittyContractAddress` que nos permita cambiar esta dirección en el futuro en caso de que algo le suceda al contrato de los CryptoKitties.

## Pongamoslo a Prueba

Actualicemos el codigo de la Lección 2 para que nos permita cambiar la dirección de los contratos de los CryptoKitties.

1. Elimina la linea donde hemos codificado `ckAddress`.

2. Cambia la linea donde hemos creado `kittyContract` para que solo declare la variable — p.ej. déjala sin definición.

3. Crea una función llamada `setKittyContractAddress`. Tomará un solo argumento, `_direccion` (una `dirección`), y debe ser una función `externa`.

4. Dentro de la función, agrega una linea que define `kittyContract` igual a `KittyInterface(_address)`.

> Nota: Si notas un error de seguridad en esta función, no te preocupes — lo arreglaremos en el siguiente capítulo ;)
