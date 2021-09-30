---
title: Imutabilidade dos Contratos
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

          // 1. Remova isto:
          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          // 2. Mude isso para somente uma declaração:
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // 3. Adicione o método setKittyContractAddress aqui

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

Até agora, Solidity pareceu bastante similar a outras linguagens como JavaScript. Mas as aplicações distribuídas em Ethereum são um tanto diferentes de aplicações normais em diversas maneiras.

Para começar, após você implantar um contrato em Ethereum, este é **_imutável_**, quer dizer que ele nunca poder ser modificado ou melhorado novamente.

O código que você implantou para um contrato esta lá permanentemente, para sempre, na blockchain. Esta é uma das razões na qual a segurança em Solidity é uma grande preocupação. Se houver uma falha no código do contrato, não há maneira de remendar depois. Você precisará dizer aos seus usuários para começarem a usar um outro smart contract que tem a correção.

Mais isto também é uma parte essencial dos smart contracts. O código é a lei. Se você ler o código do smart contract e verificá-lo, você pode ter certeza que toda vez que chamar aquela função sempre irá acontecer exatamente aquilo que o código diz. Ninguém pode mudar essa função depois e retornar resultados inesperados.

## Dependências externas

Na Lição 2, nós programamos o endereço do contratos do CryptoKitties em nossa DApp. Mas o que aconteceria se o contrato dos CryptoKitties tivesse um bug e alguém destruísse todos os gatinhos?

É improvável, mas se isso acontecer iria deixar nossa DApp completamente inútil - nossa DApp iria apontar para um endereço que nunca mais retornaria qualquer gatinho. Nossos zumbis não iriam mais poder comer gatinhos, e não poderíamos modificar nosso contrato para corrigir isso.

Por esta razão, faz sentido ter algumas funções que permitem atualizar algumas partes chaves da nossa DApp.

Por exemplo, ao invés de ter um código fixo com o endereço do contrato dos CryptoKitties em nossa DApp, poderíamos ter uma função `setKittyContractAddress` que permitiria-nos mudar o endereço no futuro se caso algo acontecesse ao contrato do CryptoKitties.

## Vamos testar

Vamos atualizar o nosso código da Lição 2 para permitir a mudança do endereço do contrato do CryptoKitties.

1. Remova a linha de código onde esta fixo a variável `ckAddress`.

2. Mude a linha onde criamos `kittyContract` para declarar somente a variável - digo, não defina igual a qualquer coisa.

3. Crie uma função chamada `setKittyContractAddress`. Esta irá ter um argumento, `_address` (um `address`), e esta deve ser uma função `external`.

4. Dentro da função, adicione uma linha de código que define `kittyContract` igual a `KittyInterface(_address)`.

> Nota: Se você notou uma falha de segurança nesta função, não se preocupe - nós vamos corrigir no próximo capítulo ;)
