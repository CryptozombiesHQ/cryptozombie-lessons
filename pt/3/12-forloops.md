---
title: Laços `for`
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
            uint[] memory result = new uint[](ownerZombieCount[_owner]);
            // Comece aqui
            return result;
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
          uint counter = 0;
          for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
              result[counter] = i;
              counter++;
            }
          }
          return result;
        }

      }
---

No capítulo anterior, mencionamos que algumas vezes você irá querer usar o laço `for` para construir os conteúdos de um array em uma função ao invés de simplesmente salvar esse array no storage.

Veremos o por quê.

Para a nossa função `getZombiesByOwner`, uma implementação ingênua seria guardar os donos dos exércitos de zumbis em um storage (armazenamento) no contrato `ZombieFactory`:

```
mapping (address => uint[]) public ownerToZombies
```

Então toda vez que criamos um novo zumbi, seria simples usar `ownerToZombies[owner].push(zombieId)` para adicioná-lo no array do dono do zumbi. E `getZombiesByOwner` seria uma função bem simples:

```
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```

### O problema com esta abordagem

Esta abordagem é tentadora pela sua simplicidade. Mas vejamos o que acontece se mais tarde adicionarmos uma função que transfer um zumbi para outro dono (e com certeza queremos adicionar em uma lição posterior!).

Esta função de transferência precisaria:
1. Inserir o zumbi no array `ownerToZombies` do novo dono,
2. Remover o zumbi do array do antigo `ownerToZombies` do antigo dono,
3. Deslocar todos zumbis no array do antigo do dono para tapar o buraco, e então
4. Reduzir o tamanho do array por 1.

O passo 3 seria extremamente caro em gas, uma vez que teremos que escrever para cada zumbi de que a posição foi trocada. Se o dono tiver 20 zumbis e trocar o primeiro da lista, nós teremos que fazer 19 escritas para manter a order da lista.

Um vez que escrever em storage (armazenamento) é uma das operações mais caras em Solidity, cada chamada para essa função seria extremamente cara. E pior, ela custaria uma quantidade de gas diferente cada vez que fosse chamada, dependendo em quantos zumbis o usuário teria em seu exército e o índice que seria trocado. Então o usuário não saberia quando em gas precisaria enviar.

> Nota: É claro que poderíamos somente mover o último zumbi na lista e preencher um espaço vazio para reduzir o tamanho do array. Mas então mudaríamos a ordem dos nossos exército de zumbis toda vez que houvesse uma troca.

Desde que funções `view` não custam gas algum quando chamadas externamente, poderíamos simplesmente usar um laço `for` em `getZombiesByOwner` para iterar todos os zumbis na lista e construir um array de zumbis que pertencem a este usuário específico. Então nossa função `transfer` seria muito mais barata, um vez que não precisamos reordenar qualquer array em storage, e de certa maneira não intuitiva essa abordagem é mais barata de todas.

## Usando laços `for`

A sintaxe do laço `for` em Solidity é similar a de JavaScript.

Vejamos um exemplo onde queremos fazer um array de números pares:

```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);

  // Mantêm o registro do índex do novo array:
  uint counter = 0;

  // Itera 1 através de 10 com um laço for:
  for (uint i = 1; i <= 10; i++) {
    // Se `i` é par ...
    if (i % 2 == 0) {

      // Adiciona em nosso array
      evens[counter] = i;

      // Incrementa o contador para o próximo índex vazio em `evens`:
      counter++;
    }
  }

  return evens;
}
```

Esta função irá retornar um array com o conteúdo `[2, 4, 6, 8, 10]`.

## Vamos testar

Vamos terminar nossa função `getZombiesByOwner` escrevendo um laço `for` que itera através de todos os zumbis em nossa DApp, compara o dono parar ver se corresponde, e inseri-os em nosso array `result` antes de retorná-los.

1. Declare um `uint` chamado `counter` e atribua-o o valor `0`. Usaremos esta variável para manter o registro do índex em nosso array `result`.

2. Declare um laço `for` que começa com `uint i = 0` e vai vai através do `i < zombies.length`. Isto irá iterar em cada zumbi do nosso array.

3. Dentro do laço `for`, crie uma declaração `if` que verifica se `zombieToOwner[i]` é igual a `_owner`. Isto irá comparar dois endereços para ver se temos uma correspondência.

4. Dentro da declaração `if`:
  1. Adicione o ID do zumbi em nosso array `result` atribuindo `result[counter]` igual a `i`.
  2. Incremente o `counter` em 1 (veja o exemplo de laço `for` acima).

É isso ai - a função agora irá retornar todos os zumbis que pertencem a `_owner` sem gastar qualquer gas.
