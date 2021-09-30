---
title: Armazenamento é Caro
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiehelper.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefeeding.sol";

        contract ZombieHelper is ZombieFeeding {

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].name = _newName;
          }

          function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
            require(msg.sender == zombieToOwner[_zombieId]);
            zombies[_zombieId].dna = _newDna;
          }

          function getZombiesByOwner(address _owner) external view returns(uint[]) {
            // Comece aqui
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
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

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

            function _createZombie(string _name, uint _dna) internal {
                uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
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

      import "./zombiefeeding.sol";

      contract ZombieHelper is ZombieFeeding {

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function changeName(uint _zombieId, string _newName) external aboveLevel(2, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].name = _newName;
        }

        function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
          require(msg.sender == zombieToOwner[_zombieId]);
          zombies[_zombieId].dna = _newDna;
        }

        function getZombiesByOwner(address _owner) external view returns(uint[]) {
          uint[] memory result = new uint[](ownerZombieCount[_owner]);

          return result;
        }

      }
---

Uma das operações mais caras em Solidity é usar o `storage` (armazenamento) - particularmente escrever.

Isto porque toda vez que você escreve uma mudança em um pedaço de dado, ela escreve permanentemente na blockchain. Para sempre! Milhares de nós em todo o mundo precisam guardar esse dados em seus discos rígidos, e esta quantidade de dado continua crescendo continuamente com o tempo conforme o blockchain cresce. Então há um custo para isso.

E para manter os custos baixos, você precisa evitar escritas de dados no *storage* armazenamento exceto quando absolutamente necessário. Algumas vezes envolve uma lógica de programação ineficiente - como reconstruir um array em `memory` (memória) toda vez que a função é chamada ao invés de simplesmente salvar o array em uma variável para buscas rápidas.

Na maioria das linguagens, percorrer grande quantidade de dados é caro. Mas em Solidity, esta é a maneira mais barata do que usar `storage` se estiver em uma função `external view`, uma vez que funções `view` não custam qualquer gas para os seus usuários. (E gas custa dinheiro real para os seus usuários!).

Iremos aprender os laços `for` no próximo capítulo, mas primeiro, vamos ver como declarar listas em memória.

## Declarando listas em memória

Você pode usar a palavra reservada `memory`com arrays (litas) para criar um novo array dentro da função sem precisar do storage para nada. O array só existirá até o fim da função, e isto é um muito mais barato que atualizar um array em `storage` - de graça se for uma função `view` chamada externamente.

Aqui esta como declarar uma lista em memória:

```
function getArray() external pure returns(uint[]) {
  // Estancia um novo array em memory com o tamanho de 3
  uint[] memory values = new uint[](3);

  // Adiciona alguns valores
  values.push(1);
  values.push(2);
  values.push(3);

  // Retorna o array
  return values;
}
```

Este é um exemplo trivial para somente mostrar para você a sintaxe, mas no próximo capítulo iremos ver como combinar este laço `for` em casos reais.

>Nota: Arrays em memória **precisam** ser criados com argumento de tamanho (neste caso `3`). Atualmente não podem ser redimensionados como arrays em storage com o `array.push()`, apesar de que isto pode mudar em uma futura versão do Solidity.

## Vamos testar

Em nossa função `getZombiesByOwner`, queremos retornar um array `uint[]` com todos os zumbis que um usuário em particular possui.

1. Declare uma variável `uint[] memory` chamada `result`

2. Atribua a mesma igual a um novo array `uint`. O tamanho do array deve ser entretanto a quantidade de zumbis que este `_owner` possui, que podemos buscar olhando no mapeamento com: `ownerZombieCount[_owner]`.

3. No final da função retorne o `result`. É somente um array vazio por enquanto, mas no próximo capítulo iremos preenchê-lo.
