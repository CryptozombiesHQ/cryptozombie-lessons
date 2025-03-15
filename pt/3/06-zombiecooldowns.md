---
title: Zumbis Calmos
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

          function setKittyContractAddress(address _address) external onlyOwner {
            kittyContract = KittyInterface(_address);
          }

          // 1. Defina a função `_triggerCooldown` aqui

          // 2. Defina a função `_isReady` aqui

          function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
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
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            uint cooldownTime = 1 days;

            struct Zombie {
              string name;
              uint dna;
              uint32 level;
              uint32 readyTime;
            }

            Zombie[] public zombies;

            mapping (uint => address) public zombieToOwner;
            mapping (address => uint) ownerZombieCount;

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
                zombieToOwner[id] = msg.sender;
                ownerZombieCount[msg.sender]++;
                emit NewZombie(id, _name, _dna);
            }

            function _generateRandomDna(string memory _str) private view returns (uint) {
                uint rand = uint(keccak256(abi.encodePacked(_str)));
                return rand % dnaModulus;
            }

            function createRandomZombie(string memory _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generateRandomDna(_name);
                randDna = randDna - randDna % 100;
                _createZombie(_name, randDna);
            }

        }
      "ownable.sol": |
        pragma solidity >=0.5.0 <0.6.0;

          /**
          * @title Ownable
          * @dev O Ownable tem um endereço de proprietário e fornece funções básicas de controle de
          * autorização, isso simplifica a implementação de "permissões de usuário".
          */
          contract Ownable {
            address private _owner;

            event OwnershipTransferred(
              address indexed previousOwner,
              address indexed newOwner
            );

            /**
            * @dev O construtor Ownable define o `owner` original do contrato como o remetente
            * da conta.
            */
            constructor() internal {
              _owner = msg.sender;
              emit OwnershipTransferred(address(0), _owner);
            }

            /**
            * @return o endereço do proprietário.
            */
            function owner() public view returns(address) {
              return _owner;
            }

            /**
            * @dev Lança se chamado por qualquer conta que não seja o proprietário.
            */
            modifier onlyOwner() {
              require(isOwner());
              _;
            }

            /**
            * @return true se `msg.sender` é o proprietário do contrato.
            */
            function isOwner() public view returns(bool) {
              return msg.sender == _owner;
            }

            /**
            * @dev Permite que o proprietário atual abra mão do controle do contrato.
            * @notice Renunciar à propriedade deixará o contrato sem proprietário.
            * Não será mais possível chamar as funções com o modificador `onlyOwner`.
            */
            function renounceOwnership() public onlyOwner {
              emit OwnershipTransferred(_owner, address(0));
              _owner = address(0);
            }

            /**
            * @dev Permite que o proprietário atual transfira o controle do contrato para um newOwner.
            * @param newOwner O endereço para transferir a propriedade para.
            */
            function transferOwnership(address newOwner) public onlyOwner {
              _transferOwnership(newOwner);
            }

            /**
            * @dev Transfere o controle do contrato para um newOwner.
            * @param newOwner O endereço para transferir a propriedade para.
            */
            function _transferOwnership(address newOwner) internal {
              require(newOwner != address(0));
              emit OwnershipTransferred(_owner, newOwner);
              _owner = newOwner;
            }
          }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

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

        function setKittyContractAddress(address _address) external onlyOwner {
          kittyContract = KittyInterface(_address);
        }

        function _triggerCooldown(Zombie storage _zombie) internal {
          _zombie.readyTime = uint32(now + cooldownTime);
        }

        function _isReady(Zombie storage _zombie) internal view returns (bool) {
            return (_zombie.readyTime <= now);
        }

        function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
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

Agora que temos a propriedade `readyTime` em nossa estrutura `Zombie`, vamos visitar o `zombiefeeding.sol` para implementar o tempo de esfriamento.

Vamos modificar a nossa função `feedAndMultiply` desta forma:

1. Gatilhos de esfriamento do zumbi, e

2. Zumbis não podem comer gatinhos até que seus períodos de esfriamento termine

Isto irá fazer com que os zumbis não possam se alimentar de gatinhos sem limites e multiplicar direto. Em futuras lições iremos adicionar a funcionalidade de batalhas, faremos com que atacar outros zumbis também dependam do esfriamento.

Primeiro, iremos definir alguma função de ajuda que faça a atribuição e checagem do `readyTime` do zumbi.

## Passando estruturas como argumentos

Você pode passar um ponteiro de storage para uma estrutura como argumento em uma função `private` ou `internal`. Isto é útil por exemplo, passar a nossa estrutura `Zombie` entre as funções.

A sintaxe deverá se parecer com isso: 

```
function _doStuff(Zombie storage _zombie) internal {
  // faça algo com _zombie aqui
}
```

Desta maneira podemos passar uma referência do nosso zumbi para uma função ao invés de passar o ID e ter que procurá-lo.

## Vamos testar

1. Comece definindo uma função `_triggerCooldown`. Esta irá receber 1 argumento, `_zombie`, um ponteiro `Zombie storage`. A função deve ser `internal`.

2. O corpo da função deve atribuir `_zombie.readyTime` para `uint32(now + cooldownTime)`.

3. Em seguida, crie uma função chamada `_isReady`. Esta função também irá receber o `Zombie storage` como argumento chamado `_zombie`. Esta será uma função `internal view` e irá retornar um `bool`.

4. O corpo da função deve retornar `(_zombie.readyTime <= now)`, quer irá validar se é `true` ou `false`. Esta função irá nos dizer se tempo o suficiente já passou desde a última vez que o zumbi se alimentou.
