---
title: Pagáveis
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

          // 1. Defina levelUpFee aqui

          modifier aboveLevel(uint _level, uint _zombieId) {
            require(zombies[_zombieId].level >= _level);
            _;
          }

          // 2. Crie a função levelUp aqui

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

          function _triggerCooldown(Zombie storage _zombie) internal {
            _zombie.readyTime = uint32(now + cooldownTime);
          }

          function _isReady(Zombie storage _zombie) internal view returns (bool) {
              return (_zombie.readyTime <= now);
          }

          function feedAndMultiply(uint _zombieId, uint _targetDna, string _species) internal {
            require(msg.sender == zombieToOwner[_zombieId]);
            Zombie storage myZombie = zombies[_zombieId];
            require(_isReady(myZombie));
            _targetDna = _targetDna % dnaModulus;
            uint newDna = (myZombie.dna + _targetDna) / 2;
            if (keccak256(_species) == keccak256("kitty")) {
              newDna = newDna - newDna % 100 + 99;
            }
            _createZombie("NoName", newDna);
            _triggerCooldown(myZombie);
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

        uint levelUpFee = 0.001 ether;

        modifier aboveLevel(uint _level, uint _zombieId) {
          require(zombies[_zombieId].level >= _level);
          _;
        }

        function levelUp(uint _zombieId) external payable {
          require(msg.value == levelUpFee);
          zombies[_zombieId].level++;
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

Até agora, nós cobrimos algumas **_funções modificadoras_**. Pode até ser difícil tentar lembrar de tudo, então vamos para uma rápida revisão:

1. Temos os modificadores de visibilidade que controlam quando em onde a função pode ser chamada: `private` significa que somente pode ser chamada de outras funções dentro do contrato; `internal` é como `private` mas também pode ser chamada por contratos que herdaram este contrato; `external` pode ser chamada somente de fora do contrato; e finalmente `public` que pode ser chamada de qualquer lugar, tanto internamente quando externamente.

2. Nós também temos os modificadores de estado, que nós dizem como as funções interagem com o Blockchain: `view` nos diz que ao rodar a função, nenhum dado será salvo/alterado. `pure` nos diz que não somente a função não irá salvar algum dado na blockchain, mas também que não irá ler qualquer dado da blockchain. Ambas não custam qualquer gas para chamar se forem chamadas externamente ao contrato (mas irão custar se chamadas internamente por outra função).

3. Então nós temos os `modifiers` (modificadores personalizáveis), que aprendemos sobre na Lição 3: `onlyOwner` e `aboveLevel` por exemplo. Para esses podemos definir uma lógica customizada para determinar como eles irão afetar a função.

Tais modificadores podem ser empilhados juntos na definição da função, conforme exemplo:

```
function test() external view onlyOwner anotherModifier { /* ... */ }
```

Neste capítulo, iremos introduzir mais um modificador de função: `payable`.

## O Modificador `payable`

Funções `payable` são parte do que faz o Solidity e Ethereum tão legais - eles são um tipo de função especial que podem receber Ether.

Vamos imaginar por um minuto. Quando você chama uma função em API em um servidor web, você não pode enviar Dólares junto com a sua função — também não pode enviar Bitcoin.

Mas em Ethereum, por que ambos o dinheiro (_Ether_), e o dado (*corpo da transação*), e o código do contrato todos estão contidos em Ethereum, é possível para você chamar uma função **e** pagar algum dinheiro para um contrato a qualquer momento.

Isto permite um lógica realmente bem interessante, como exigir um certo pagamento para que o contrato execute uma função.

## Vejamos um exemplo
```
contract OnlineStore {
  function buySomething() external payable {
    // Verifica para ter certeza que 0.001 ether foi enviado:
    require(msg.value == 0.001 ether);
    // Se enviado, transfira um item digital para o chamador da função
    transferThing(msg.sender);
  }
}
```

Aqui, `msg.value` é a forma para ver quanto Ether foi enviado para o contrato, e `ether` é uma unidade interna.

O que aconteceu aqui é que alguém queria chamar uma função da web3.js (de alguma interface JavaScript da DApp) conforme exemplo:

```
// Assumindo que `OnlineStore` aponta para o seu contrato no Ethereum:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

Perceba o campo `value` (valor), onde a função javascript irá especificar quanto `ether` à enviar (0.001). Se você pensar que a transação é como um envelope, e os parâmetros que você envia para a chamada da função são os conteúdos da carta que você colocou dentro, então adicionar o `value` é como colocar dinheiro dentro do envelope - a carta e o dinheiro serão entregues juntos ao destinatário.

>Nota: Se a função não for marcada como `payable` e você tentar enviar Ether como feito acima, a função irá rejeitar a sua transação.

## Vamos testar

Vamos criar uma função `payable` em nosso jogo de zumbi.

Digamos que nosso jogo tem uma característica onde os usuários podem pagar ETH para aumentar os níveis dos zumbis. O ETH será guardado no contrato, que pertence a você - este é um simples exemplo de como você pode ganhar dinheiro com os seus jogos!

1. Defina um `uint` chamado `levelUpFee`, e atribua igual a `0.001 ether`.

2. Crie uma função chamada `levelUp`. Que terá um parâmetro, `_zombieId`, um `uint`. E que deverá ser `external` e `payable`.

3. A função primeiro deverá exigir com o `require` que o `msg.value` seja igual ao `levelUpFee`.

4. Então deverá incrementar o nível `level` do zumbi: `zombies[_zombieId].level++`.
