---
title: "Bônus: Genes de Gatinhos"
actions: ['verificarResposta', 'dicas']
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

          address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
          KittyInterface kittyContract = KittyInterface(ckAddress);

          // Modifique a função aqui:
          function feedAndMultiply(uint _zombieId, uint _targetDna) public {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            // Adicione a declaração de `if` aqui
            _createZombie("NoName", newDna);
          }

          function feedOnKitty(uint _zombieId, uint _kittyId) public {
            uint kittyDna;
            (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
            // E modifique a função aqui:
            feedAndMultiply(_zombieId, kittyDna);
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

        address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
        KittyInterface kittyContract = KittyInterface(ckAddress);

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

A lógica da nossa função agora esta completa... mas vamos adicionar uma característica de bônus.

Vamos fazer então os zumbis feitos de gatos com uma característica única que mostra que são gatos-zumbis.

Para fazer isso, podemos adicionar um código de gatinho especial no DNA zumbi.

Se você lembrar da lição 1, atualmente usamos somente os primeiros 12 dígitos do nosso DNA de 16 dígitos para determinar a aparência do zumbi. Então vamos usar os últimos 2 dígitos não utilizados para manipular essa característica especial.

Digamos que o gato-zumbi tem `99` como seus últimos 2 dígitos de DNA (desde que gatos tem 9 vidas). Então em nosso código, digamos `se` o zumbi vem de um gato, então definimos os últimos dois dígitos do DNA como `99`.

## Declarações de condição (IF)

Declaração de condições em Solidity parecem com as de JavaScript:

```
function eatBLT(string sandwich) public {
  // Lembre-se com strings, temos que comprar os seus hashes em keccak256
  // para checar igualdade
  if (keccak256(sandwich) == keccak256("BLT")) {
    eat();
  }
}
```

# Vamos testar

Vamos implementar o genes dos gatos em nosso código zumbi.

1. Primeiro, vamos mudar a definição para a função `feedAndMultiply` então ela terá um terceiro argumento: uma `string` chamada `_species`

2. Próximo, após calcularmos o DNA do novo zumbi, vamos adicionar uma condição `if` comparando o hash  `keccak256` da `_species` e a string `"kitty"`.

3. Dentro da condição `if`, nós queremos substituir os dois últimos dígitos do DNA com `99`. Uma maneira de fazer isso é usando a lógica: `newDna = newDna - newDna % 100 + 99;`.

  > Explicação: Suponha que `newDna` é `334455`. Então `newDna % 100` é `55`, então `newDna - newDna % 100` é `334400`. Finalmente adicione `99` para ter `334499`.

4. Por último, nós precisamos mudar dentro da chamada da função `feedOnKitty`. Quando ela chamar `feedAndMultiply`, adicione o parâmetro `"Kitty"` no final.
