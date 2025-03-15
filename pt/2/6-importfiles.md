---
title: Importar (Import)
actions: ['verificarResposta', 'dicas']
requireLogin: true
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity >=0.5.0 <0.6.0;

        // declare a importação aqui

        contract ZombieFeeding is ZombieFactory {

        }
      "zombiefactory.sol": |
        pragma solidity >=0.5.0 <0.6.0;

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

            function _createZombie(string memory _name, uint _dna) private {
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
                _createZombie(_name, randDna);
            }

        }
    answer: >
      pragma solidity >=0.5.0 <0.6.0;

      import "./zombiefactory.sol";

      contract ZombieFeeding is ZombieFactory {

      }

---

Uau! Você vai perceber que nós limpamos todo o código a direita, e agora você tem as abas no topo do seu editor. Vá em frente, clique nas abas e veja o que acontece.

Nosso código estava ficando um tanto grade, então separamos em vários arquivos para torná-los mais gerenciáveis. Esta é a forma normal de gerenciar grandes bases de código em seus projetos em Solidity.

Quando você tiver vários arquivos e você quiser importar um arquivo em outro, Solidity usa a palavra reservada `import`.

```
import "./someothercontract.sol";

contract newContract is SomeOtherContract {

}
```

Então se temos o arquivo chamado `someothercontract.sol` no mesmo diretório que este contrato (por isso o `./`), ele será importado pelo compilador.

# Vamos testar

Agora que temos uma estrutura de múltiplos-arquivos, precisamos usar o `import` para ler o conteúdo de outros arquivos:

1. Import `zombiefactory.sol` em nosso novo arquivo, `zombiefeeding.sol`.
