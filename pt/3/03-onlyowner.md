---
title: Função Modificadora onlyOwner
actions: ['verificarResposta', 'dicas']
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

          KittyInterface kittyContract;

          // Modifique esta função:
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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

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
      "ownable.sol": |
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * functions, this simplifies the implementation of "user permissions".
         */
        contract Ownable {
          address public owner;

          event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

          /**
           * @dev The Ownable constructor sets the original `owner` of the contract to the sender
           * account.
           */
          function Ownable() public {
            owner = msg.sender;
          }


          /**
           * @dev Throws if called by any account other than the owner.
           */
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }


          /**
           * @dev Allows the current owner to transfer control of the contract to a newOwner.
           * @param newOwner The address to transfer ownership to.
           */
          function transferOwnership(address newOwner) public onlyOwner {
            require(newOwner != address(0));
            OwnershipTransferred(owner, newOwner);
            owner = newOwner;
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

        function setKittyContractAddress(address _address) external onlyOwner {
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
/**
 * @dev Lança um erro se for chamada por outra conta que não seja o dono.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```

Podemos usar este modificar conforme segue:

```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // Veja o uso de `onlyOwner` abaixo:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

Perceba que `onlyOwner` modifica a função `likeABoss`. Quando você chama `likeABoss`, o código dentro de `onlyOwner` executa **primeiro**. Depois quando chega na declaração `_;` em `onlyOwner`, volta e executa o código dentro de `likeABoss`.

Enquanto há outras maneiras de usar os modificares, um dos casos mais comuns são os de adicionar rapidamente verificações de `require` antes de uma função executar.

No caso de `onlyOwner`, adicionar este modificador à função faz com que **only** (somente) o **owner** (dono) do contrato (você, se você implantou-o) possa chamar essa função.

>Nota: Dar ao dono poderes especiais sobre o contrato assim frequentemente é necessário, mas isso também pode ser malicioso. Por exemplo, o dono pode adicionar uma função _backdoor_ que permitiria a transferência do zumbi de qualquer pessoa para ele mesmo!

>Então é importante lembrar que somente porque uma DApp está no Ethereum, não quer dizer automaticamente que ela é decentralizado - você tem que ler todo o código fonte para ter certeza que ela é livre de controles especiais impostos pelo dono que você deve se preocupar. Como um desenvolvedor, há um cuidadoso equilíbrio entre manter o controle sobre uma DApp, para que você possar arrumar potenciais problemas, e construir uma plataforma sem dono, para que os usuários possam confiar e manter os dados seguros.

## Vamos testar

Agora podemos restringir o acesso a `setKittyContractAddress` para que ninguém além de nós possa modificá-la no futuro.

1. Adicione o modificador `onlyOwner` na `setKittyContractAddress`.
