---
title: Unidades de Tempo
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefactory.sol": |
        pragma solidity ^0.4.19;

        import "./ownable.sol";

        contract ZombieFactory is Ownable {

            event NewZombie(uint zombieId, string name, uint dna);

            uint dnaDigits = 16;
            uint dnaModulus = 10 ** dnaDigits;
            // 1. Defina o `cooldownTime` aqui

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
                // 2. Atualize a seguinte linha:
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
---

A propriedade `level` (nível) é bem auto explicativa. Mais tarde, quando criarmos um sistema de batalha, zumbis que vencerem mais batalhas irão subir de nível com o tempo e ganhar acesso a novas habilidades.

A propriedade `readyTime` requer um pouco mais de explicação. A ideia é adicionar um "tempo de esfriamento", uma quantidade de tempo que o zumbi precisa esperar para se alimentar ou atacar antes que possar alimentar / atacar novamente. Sem isto, o zumbi poderia atacar múltiplas 1.000 vezes por dia, algo que poderia tornar o jogo muito fácil.

Para manter o registro de quanto tempo um zumbi precisa esperar até o poder atacar novamente, podemos usar as unidades tempo em Solidity.

## Time units
## Unidades de tempo

Solidity fornece algumas unidades nativas para lidar com o tempo.

A variável `now` (agora) irá retornar o *unix timestamp* atual (o número de segundos que passou desde 1 de Janeiro de 1970). O tempo unix no momento que escrevo este tutorial é `1515527488`.

>Nota: O tempo unix é tradicionalmente guardado em um número de 32-bits. Isto irá causar o problema do "Ano 2038", quando os unix timestamps irão sobre carregar e quebrar um monte de sistema legados. Então se queremos a nossa DApp continuar rodando mais do que 20 anos a partir de agora, podemos usar um número de 64-bits - mas nossos usuários terão que gastar mais gas para usar a nossa DApp no momento. Decisões de projeto!

Solidity também contem os tempo em unidades de `seconds` (segundos), `minutes` (minutos), `hours` (horas), `days` (dias), `weeks` (semanas). Estes irão converter para um `uint` do número em segundos no período de tempo. Então `1 minutes` são `60`, `1 hours` são `3600`(60 segundos x 60 minutos), `1 days` são `86400` (24 hours x 60 minutos x 60 segundos), etc.

Segue um exemplo de como essas unidades de tempo são úteis:

```
uint lastUpdated;

// Atribui `lastUpdated` para `now`
function updateTimestamp() public {
  lastUpdated = now;
}

// Irá retornar `true` se 5 minutos se passaram desde de que `updateTimestamp` foi
// chamado, `false` se os 5 minutos ainda passaram
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

Podemos usar estas unidades de tempo para o `cooldown` (esfriar) do Zumbi.

## Vamos testar

Vamos adicionar o tempo de esfriamento em nossa DApp, e ao fazer isso os zumbis terão que esperar **1 dia** após atacar ou se alimentar para atacar novamente.

1. Declare um `uint` chamado `cooldownTime`, e atribua-lhe o valor igual a `1 days`. (Não ligue para péssima gramática - se você atribuir igual a "1 day", o mesmo não irá compilar!)

2. Uma vez que adicionamos o `level` e `readyTime` a nossa estrutura `Zombie` no capítulo anterior, precisamos atualizar a função `_createZombie()` com o número correto de argumentos ao criar uma nova estrutura `Zombie`

  Atualize a linha `zombies.push` e adicione 2 argumentos a mais: `1` (para `level`), e `uint32(now + cooldownTime)` (para `readyTime`).

>Nota: O `uint32(...)` é necessário porque `now` (agora) returna um `uint256` por padrão. Então precisamos deixar explícito a conversão para um `uint32`.

`now + cooldownTime` será igual o *unix timestamp* atual (em segundos) mais o número de segundos em 1 dia - que é igual o número de segundos de 1 dia a partir de agora. Mais tarde iremos comparar para ver se este `readyTime` do zumbi é maior do que `now` (agora) e ver se passou tempo o suficiente para usar o zumbi novamente.

Implementaremos a funcionalidade para limitar as ações baseado no `readyTime` no próximo capítulo.
