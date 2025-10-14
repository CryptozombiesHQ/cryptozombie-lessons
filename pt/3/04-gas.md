---
title: Gas
actions: ['checkAnswer', 'hints']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
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
                // Add new data here
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

      import "./ownable.sol";

      contract ZombieFactory is Ownable {

          event NewZombie(uint zombieId, string name, uint dna);

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

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
---

Ótimo! Agora sabemos como atualizar porções importantes da DApp enquanto prevenimos que outros usuários estraguem com nossos contratos.

Vamos ver outra maneira que Solidity é um tanto diferente de outras linguagens de programação:

## Gas — o combustível utilizado por DApps Ethereum

Em Solidity, seus usuários tem que pagar toda vez que executam uma função em sua DApp usando uma moeda chamada **_gas_**. Usuários compram gas com Ether (a moeda no Ethereum), então os seus usuários precisam gastar ETH para executar funções em sua DApp.

Quanto gas é preciso para executar uma função depende o quão complexo é a lógica desta função. Cada operação individual tem um **_custo em gas_** baseado mais ou menos em quanto recursos computacionais serão necessários para realizar essa operação (exemplo: escrever em storage é muito mais caro do que adicionar dois inteiros). O total de **_custo em gas_** da sua função é soma de todos os custo de todas as operações de forma individuais.

E porque executar funções custam dinheiro real para os seus usuários, otimização do código é muito mais importante em Ethereum do que em qualquer outra linguagem de programação. Se o seu código é desleixado, seus usuários terão que pagar muito mais para executar suas funções - e isto pode adicionar milhões de dólares em custos desnecessários através de milhares de usuários.

## Por que o gas é necessário?

Ethereum é como um grande, lento, mas extremamente seguro computador. Quando você executa uma função, cada um dos nós na rede precisa rodar esta mesma função e verificar suas saídas - milhares de nos verificando cada execução de cada função é o que faz do Ethereum decentralizado, e seus dados imutáveis e resistentes a censura.

Os criadores do Ethereum queriam ter certeza que ninguém poderia entupir a rede com laços infinitos, ou estragar todos os recursos da rede com computações realmente intensivas. Então eles fizeram com que as transações não fossem grátis, e os usuários tem que pagar pelo tempo de computação como também pela guarda dos dados

> Nota: Isto não é necessariamente verdade para outras blockchain, como a que os autores do CryptoZombies estão construindo na Loom Network. E provavelmente nunca irá fazer sentido rodar um jogo como World of Warcraft diretamente na rede mainnet do Ethereum - o custo em gas seria proibitivamente caro. Mas este pode rodar em uma sidechain com um algorítimo de consenso diferente. Iremos falar mais sobre os tipos de DApps que você poderia implantar em sidechains vs a mainnet do Ethereum em futuras lições.

## Empacotamento da estrutura para economizar gas

Na Lição 1, nós mencionamos que existem outros tipos de `uint`s: `uint8`, `uint16`, `uint32`, etc.

Normalmente não há benefício algum em usar estes subtipos porque Solidity reserva 256 bits de espaço independente do tamanho do `uint`. Por exemplo, usar `uint8` ao invés de `uint` (`uint256`) não irá economizar gas algum.

Mas há uma exceção para isto: dentro das `struct`s.

Se você tiver múltiplas `uint`s dentro de uma `struct`, usando um tamanho menor de `uint` quando possível irá permitir o Solidity de empacotar essas variáveis juntas para usar menos espaço. Por exemplo:

```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` irá custar menos gas que `normal` porque usar o empacotamento
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

Por essa razão, dentro de uma estrutura você irá querer usar o menor subtipo de integer que você puder.

Você também quer juntar tipos de dados idênticos (exemplo: colando um perto do outro dentro da estrutura) então Solidity pode minimizar o espaço requerido para guardar a estrutura. Por exemplo, a estrutura com campos `uint c; uint32 a; uint32 b;` irá custar menos gas que a estrutura com os campos `uint32 a; uint c; uint32 b;` porque o  os campos `uint32` estão agrupados.

## Vamos testar

Nesta lição, iremos adicionar 2 novas características para os nossos zumbis: `level` (nível) e `readyTime` - que mais tarde serão utilizados parar implementar o tempo de *cooldown* (esfriar) para limitar o quão frequente um zumbi pode se alimentar.

Vamos voltar então para `zombiefactory.sol`.

1. Adicione duas propriedades para a nossa estrutura `Zombie`: `level` (um `uint32`), e `readyTime` (também um `uint32`). Queremos empacotar esses tipos juntos, então vamos colocá-los no final da estrutura.

Um 32 bits é mais do que o suficiente para guardar o nível do zumbi e uma marca de horário, isso irá economizar-nos alguns custos em gas por empacotar o dado mais junto do que usar um `uint` (256-bits).
