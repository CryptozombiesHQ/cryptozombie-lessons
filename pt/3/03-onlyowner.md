---
title: Função Modificadora onlyOwner
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

          // Modifique esta função:
          function setKittyContractAddress(address _address) external {
            kittyContract = KittyInterface(_address);
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
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

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

            function _createZombie(string memory _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna)) - 1;
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
        * @dev The Ownable contract has an owner address, and provides basic authorization control
        * functions, this simplifies the implementation of "user permissions".
        */
        contract Ownable {
          address private _owner;

          event OwnershipTransferred(
            address indexed previousOwner,
            address indexed newOwner
          );

          /**
          * @dev The Ownable constructor sets the original `owner` of the contract to the sender
          * account.
          */
          constructor() internal {
            _owner = msg.sender;
            emit OwnershipTransferred(address(0), _owner);
          }

          /**
          * @return the address of the owner.
          */
          function owner() public view returns(address) {
            return _owner;
          }

          /**
          * @dev Throws if called by any account other than the owner.
          */
          modifier onlyOwner() {
            require(isOwner());
            _;
          }

          /**
          * @return true if `msg.sender` is the owner of the contract.
          */
          function isOwner() public view returns(bool) {
            return msg.sender == _owner;
          }

          /**
          * @dev Allows the current owner to relinquish control of the contract.
          * @notice Renouncing to ownership will leave the contract without an owner.
          * It will not be possible to call the functions with the `onlyOwner`
          * modifier anymore.
          */
          function renounceOwnership() public onlyOwner {
            emit OwnershipTransferred(_owner, address(0));
            _owner = address(0);
          }

          /**
          * @dev Allows the current owner to transfer control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
          */
          function transferOwnership(address newOwner) public onlyOwner {
            _transferOwnership(newOwner);
          }

          /**
          * @dev Transfers control of the contract to a newOwner.
          * @param newOwner The address to transfer ownership to.
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

Agora que nosso contrato base `ZombieFactory` herda de `Ownable`, nós podemos usar a função modificadora `onlyOwner` e também em `ZombieFeeding`.

Isto por que é assim que a herança de contratos funciona. Lembre-se:

```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```

Sendo assim `ZombieFeeding` é também `Ownable`, e tem acesso as funções / eventos / modificadores do contrato `Ownable`. Isto se aplica para qualquer contrato que herdar de `ZombieFeeding` no futuro também.

## Funções Modificadoras

Uma função modificadora se parece com uma função, mas usa a palavra reservada `modifier` ao invés da palavra reservada `function`. E não pode ser chamada diretamente como um função - ao invés nós podemos anexar o nome da função modificador no final da definição da função para mudar o comportamento da função.

Vamos olhar de perto e examinar o `onlyOwner`:

```
pragma solidity >=0.5.0 <0.6.0;

/**
 * @title Ownable
 * @dev O contrato Ownable tem um endereço de proprietário e fornece controle básico de autorização
  * funções, isso simplifica a implementação de "permissões de usuário".
  */
contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev O construtor Ownable define o proprietário original do contrato como o remetente
   * conta.
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
   * @return true se `msg.sender` for o proprietário do contrato.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Permite que o proprietário atual renuncie ao controle do contrato.
   * @notice Renunciar à propriedade deixará o contrato sem proprietário.
   * Não será possível chamar as funções com o modificador `onlyOwner`
   * mais.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Permite que o proprietário atual transfira o controle do contrato para um novo proprietário.
   * @param newOwner O endereço para transferir a propriedade.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfere o controle do contrato para um novo proprietário.
   * @param newOwner O endereço para transferir a propriedade.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}
```

Observe o modificador `onlyOwner` na função `renounceOwnership`. Quando você chama `renounceOwnership`, o código dentro de `onlyOwner` executa **primeiro**. Então, quando ele atinge a declaração `_;` em `onlyOwner`, ele volta e executa o código dentro de `renounceOwnership`.

Enquanto há outras maneiras de usar os modificares, um dos casos mais comuns são os de adicionar rapidamente verificações de `require` antes de uma função executar.

No caso de `onlyOwner`, adicionar este modificador à função faz com que **only** (somente) o **owner** (dono) do contrato (você, se você implantou-o) possa chamar essa função.

>Nota: Dar ao dono poderes especiais sobre o contrato assim frequentemente é necessário, mas isso também pode ser malicioso. Por exemplo, o dono pode adicionar uma função _backdoor_ que permitiria a transferência do zumbi de qualquer pessoa para ele mesmo!

>Então é importante lembrar que somente porque uma DApp está no Ethereum, não quer dizer automaticamente que ela é decentralizado - você tem que ler todo o código fonte para ter certeza que ela é livre de controles especiais impostos pelo dono que você deve se preocupar. Como um desenvolvedor, há um cuidadoso equilíbrio entre manter o controle sobre uma DApp, para que você possar arrumar potenciais problemas, e construir uma plataforma sem dono, para que os usuários possam confiar e manter os dados seguros.

## Vamos testar

Agora podemos restringir o acesso a `setKittyContractAddress` para que ninguém além de nós possa modificá-la no futuro.

1. Adicione o modificador `onlyOwner` na `setKittyContractAddress`.
