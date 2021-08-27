---
title: O Que Zumbis Comem?
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        // Crie a KittyInterface aqui

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            _createZombie("NoName", newDna);
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

            function _generatePseudoRandomDna(string _str) private view returns (uint) {
                uint rand = uint(keccak256(_str));
                return rand % dnaModulus;
            }

            function createPseudoRandomZombie(string _name) public {
                require(ownerZombieCount[msg.sender] == 0);
                uint randDna = _generatePseudoRandomDna(_name);
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

        function feedAndMultiply(uint _zombieId, uint _targetDna) public {
          require(msg.sender == zombieToOwner[_zombieId]);
          Zombie storage myZombie = zombies[_zombieId];
          _targetDna = _targetDna % dnaModulus;
          uint newDna = (myZombie.dna + _targetDna) / 2;
          _createZombie("NoName", newDna);
        }

      }
---

Esta na hora de alimentar os nossos zumbis! E o que zumbis mais gostam de comer?

Bom, acontece que CryptoZombies adoram comer...

**CryptoKitties!** 😱😱😱

(Sim, é sério 😆)

Para fazer isso nós precisamos ler o kittyDna do smart contract do CryptoKitties. Podemos fazer isso porque o dado dos CryptoKitties é gravado de forma aberta na blockchain. O blockchain não é legal?!

Não se preocupe - nosso jogo atual não irá machucar qualquer CryptoKitty. Nós somente vamos *ler* os dados do CryptoKitties, nós não podemos deletá-lo 😉

## Interagindo com outros contratos

Para que o nosso contrato converse com outro contrato na blockchain que não é nosso, primeiro temos que definir uma **_interface_**.

Vamos ver um simples exemplo. Digamos que existe um contrato na blockchain que se parece com isto:

```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

Este seria um simples contrato onde qualquer um pode guardar um número da sorte, e esse número seria associado ao seu endereço no Ethereum. Então qualquer um pode olhar o número desta pessoa somente passando o endereço dessa pessoa.

Agora digamos que nós temos um contrato externo que quer ler o dado deste contrato usando a função `getNum`.

Primeiro nós gostaríamos de definir uma **_interface_** para o contrato `LuckyNumber`:

```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```

Perceba que isto parece com a definição de um contrato, com poucas diferenças. Primeiro, declaramos somente as funções que queremos interagir - neste caso `getNum` - e nós não mencionamos qualquer outra função ou variáveis de estado.

Segundo, nós não definimos os corpos das funções. Ao invés dos "braces" (`{` e `}`), nós simplesmente terminamos declaração da função com um ponto-e-vírgula (`;`).

Então isso se parece com um esqueleto de contrato. Isto é como o compilador sabe sobre uma interface.

Ao incluir esta interface no código da nossa aplicação distribuída (dapp) nosso contrato sabe como as funções do outro contrato se parecem, e como executá-las, e qual tipo de resposta esperar.

Iremos na verdade executar funções em um outro contrato em nossa próxima lição, mas por enquanto vamos declarar as nossas interfaces para o contrato do CryptoKitties.

# Vamos testar

Nós já olhamos o código fonte do CryptoKitties pra você, e encontramos a função chamada `getKitty` que retorna todos os dados do gato, incluindo seus "genes" (que é o que nosso jogo de zumbi precisa para formar um novo zumbi!).

A função parece com isso:

```
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
) {
    Kitty storage kit = kitties[_id];

    // se esta variável for 0 então não é gestante
    isGestating = (kit.siringWithId != 0);
    isReady = (kit.cooldownEndBlock <= block.number);
    cooldownIndex = uint256(kit.cooldownIndex);
    nextActionAt = uint256(kit.cooldownEndBlock);
    siringWithId = uint256(kit.siringWithId);
    birthTime = uint256(kit.birthTime);
    matronId = uint256(kit.matronId);
    sireId = uint256(kit.sireId);
    generation = uint256(kit.generation);
    genes = kit.genes;
}
```

A função parece um pouco diferente da função que nós precisamos. Você pode ver o que ela retorna... um monte de valores diferentes. Se você vem de uma linguagem de programação como Javascript, isto é diferente - em Solidity você pode retornar mais de um valor por função.

Agora que nós sabemos como a função deve ser, podemos usá-la para criar uma interface:

1. Defina uma interface chamada `KittyInterface`. Lembrando, isto parece com a criação um novo contrato - usamos a palavra reservada `contract`.

2. Dentro da interface, defina a função `getKitty` (que deve ser uma cópia da função acima, mas com o ponto-e-vírgula após a declaração `returns`, ao invés de tudo que esta dentro dos braces `{` e `}`).
