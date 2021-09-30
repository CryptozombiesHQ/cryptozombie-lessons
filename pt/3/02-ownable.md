---
title: Contratos Proprietários
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        // 1. Importe aqui

        // 2. Herde Aqui:
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
---

Você percebeu a falha de segurança no capítulo anterior?

`setKittyContractAddress` é um `external`, então qualquer um pode chamá-lo! Isso quer dizer que qualquer um que chamar a função pode mudar o endereço do contrato do CryptoKitties, e quebrar a nossa aplicação para todos os usuários.

Nós queremos uma maneira de atualizar este endereço em nosso contrato, mas nós não queremos que qualquer um possa atualizá-lo.

Para lidar com casos assim, uma prática que se tornou comum é tornar o contrato `Ownable` (Proprietário) - quer dizer que tem um dono (você no caso) que tem privilégios especiais.

## Contratos `Ownable` do OpenZeppelin

Abaixo um contrato `Ownable` pego da biblioteca Solidity do **_OpenZeppelin_**. OpenZeppelin é uma biblioteca de contratos seguros e auditados pela comunidade que você pode usar em suas próprias DApps. Após esta lição, recomendamos fortemente que você visite o site deles para maior aprendizado.

Leia com atenção o contrato abaixo. Você verá algumas coisas que nós já aprendemos, mas não se preocupe, iremos falar mais sobre isso em seguida.

```
/**
 * @title Ownable
 * @dev Um contrato Ownable tem um endereço de dono, e fornece funções básicas de autorização,
 * que simplificam a implementação de "permissões de usuário".
 */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev O construtor Ownable define o `owner` (dono) original do contrato como o sender
   * da conta
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Lança um erro se chamado por outra conta que não seja o dono.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Permite que o atual dono transfira o controle do contrato para um novo dono.
   * @param newOwner O endereço de transferência para o novo dono.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```

Um pouco de novas coisas que não vimos antes:

- Construtores: `function Ownable()` é um **_construtor_**, que é uma função opcional e especial que tem o mesmo nome do contrato. Esta será executada somente uma vez, quando o contrato é criado a primeira vez.
- Funções Modificadoras: `modifier onlyOwner()`. Modificadores são um tipo de meia-função que são usadas para modificar outras funções, normalmente usadas para checar algo requerido antes da execução. Neste caso, `onlyOwner` pode ser usada para limitar o acesso então **only** (somente) o **owner** (dono) do contrato pode executar esta função. Nós iremos falar mais sobre funções modificadoras no próximo capítulo, e o que esse `_;` faz.
- Palavra-chave `indexed`: não se preocupe com isso, nós ainda não precisamos.

Então o contrato `Ownable` basicamente faz o seguinte:

1. Quando o contrato é criado, este construtor define o `owner` (dono) para `msg.sender` (a pessoa que implantou-o na blockchain)

2. Este adiciona um modificador `onlyOwner`, que restringe o acesso a certas função somente para o `owner` (dono)

3. Também permite a transferência de um contrato para o novo `owner` (dono)

O `onlyOwner` é um requisito muito comum na maior parte dos contratos de DApps em Solidity que já começam com um copia/cola do contrato `Ownable`, e o primeiro contrato já o herda.

Já que nós queremos limitar o `setKittyContractAddress` para `onlyOwner`, teremos que fazer o mesmo para o nosso contrato.

## Vamos testar

Nós já copiamos o código do contrato `Ownable` em um novo arquivo, `ownable.sol`. Vá em frente e faça o `ZombieFactory` herdá-lo.

1. Modifique nosso código para importar com `import` o conteúdo de `ownable.sol`. Se você não lembra como fazer isso de uma olhada em `zombiefeeding.sol`.

2. Modifique o contrato `ZombieFactory` para herdar de `Ownable`. Novamente, você pode olhar em `zombiefeeding.sol` se você não lembra como fazer isso.
