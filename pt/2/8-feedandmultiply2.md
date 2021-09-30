---
title: DNA Zumbi
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            // comece aqui
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

            function _createZombie(string _name, uint _dna) private {
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

Vamos terminar de escrever a função `feedAndMultiply`.

A fórmula para o cálculo do novo DNA zumbi é simples: Simplesmente a média entre o DNA do zumbi alimentado e o DNA do alvo.

Por exemplo:

```
function testDnaSplicing() public {
  uint zombieDna = 2222222222222222;
  uint targetDna = 4444444444444444;
  uint newZombieDna = (zombieDna + targetDna) / 2;
  // ^ será igual a 3333333333333333
}
```

Mais tarde podemos deixar a nossa fórmula mais complicada se quisermos, como adicionar alguma aleatoriedade ao DNA do novo zumbi. Mas por enquanto vamos mante-lá simples - nós sempre podemos voltar aqui mais tarde.

# Vamos testar

1. Primeiro precisamos ter certeza que o `_targetDna` não é maior do que 16 dígitos. Para isso nós vamos definir `_targetDna` igual à `_targetDna % dnaModulus` para somente ter os últimos 16 dígitos.

2. Depois nossa função deve declarar um `uint` chamado `newDna`, e definir igual a média do DNA do `myZombie` e `_targetDna` (como o exemplo acima).

  > Nota: Você pode acessar as propriedades do `myZombie` usando `myZombie.name` e `myZombie.dna`

3. Uma vez que temos o novo DNA, vamos chamar a função `_createZombie`. Você pode olhar na aba `zombiefactory.sol` se você esqueceu quais parâmetros esta função precisa. Perceba que ela requer um nome, então vamos definir o nome do nosso novo zumbi como `"NoName"` por enquanto - nós podemos escrever uma função parar mudar os nomes mais tarde.

> Nota: Sobre as "sujeiras" no código Solidity, talvez você tenha notado algum problema em nosso código aqui! Não se preocupe, vamos arrumar isso no próximo capítulo ;)
