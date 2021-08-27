---
title: Armazenamento vs Memória (Storage vs Memory)
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode:
      "zombiefeeding.sol": |
        pragma solidity ^0.4.19;

        import "./zombiefactory.sol";

        contract ZombieFeeding is ZombieFactory {

          // Comece aqui

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
        }

      }
---

Em Solidity, existem dois lugares onde você pode guardar as variáveis - na `storage` (armazenamento) e na `memory` (memória).

**_Storage_** (Armazenamento) refere-se as variáveis guardadas permanentemente na blockchain. **_Memory_** (Memória) são variáveis temporárias, e são apagadas entre as chamadas externas para o seu contrato. Imagine como o disco rígido do seu computador vs memória RAM.

Na maior parte do tempo você não precisa usar essas palavras-reservadas porque a Solidity cuida disso pra você por padrão. Variáveis de estado (variáveis declaradas fora das funções) são por padrão `storage` e são escritas permanentemente na blockchain, enquanto variáveis declaradas dentro das funções são `memory` e irão desaparecer quando a função terminar.

Porém, haverão momentos em que você precisará usar tais palavras-reservadas, por exemplo quando trabalhar com **_struct_** e **_arrays_** dentro das funções:

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ Parece bem simples, mas solidity vai dar-lhe um alerta
    // avisando que você deve explicitamente declarar `storage` ou `memory` aqui.

    // Então ao invés, você deve declarar com `storage`, assim:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...neste caso `mySandwich` é um ponteiro `sandwiches[_index]`
    // em armazenamento, e...
    mySandwich.status = "Eaten!";
    // ...e isto permanentemente muda `sandwiches[_index]` na blockchain.

    // Se você só quer uma copia, você deve usar `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...neste caso `anotherSandwich` será somente uma cópia
    // do dado em memória, e...
    anotherSandwich.status = "Eaten!";
    // ...e só irá alterar a variável temporária e não terá efeito
    // em `sandwiches[_index + 1]`. Mas você pode fazer isso:
    sandwiches[_index + 1] = anotherSandwich;
    // ...se você quer a cópia das mudanças salvas na blockchain.
  }
}
```

Não se preocupe se você não entendeu completamente quando usar qual ainda - através deste tutorial nós iremos lhe mostrar quando usar `storage` e quando usar `memory`, e o compilador do Solidity também irá lhe avisar quando você deve usar uma dessas palavras-reservadas.

Por enquanto, é o suficiente para entender que há casos onde você precisará declarar explicitamente `storage` ou `memory`!

# Vamos testar

Esta na hora de dar aos nossos zumbis a habilidade de alimentar-se e multiplicar-se!

Quando um zumbi se alimenta de outra forma de vida, o seu DNA irá combinar com o DNA da outra forma de vida criando um novo zumbi.

1. Crie uma função chamada `feedAndMultiply`. Que terá dois parâmetros: `_zombieId` (um `uint`) e `_targetDna` (também um `uint`). Esta função deverá ser `public` (pública).

2. Nós não queremos que qualquer um alimente nossos zumbis! Então primeiro, vamos ter certeza que temos posse deste zumbi. Adicione uma declaração `require` para ter certeza que `msg.sender` é igual ao dono do zumbi (similar a que fizemos antes na função `createPseudoRandomZombie`).

 > Nota: Novamente, devido ao nosso verificador de respostas ser simples, ele espera que o `msg.sender` venha primeiro e irá marcar errado se você trocar a ordem. Mas normalmente quando você estiver escrevendo os seus códigos, você pode usar da forma que quiser - ambas são corretas.

3. Precisamos obter o DNA deste zumbi. Então a próxima coisa em nossa função deve ser declarar um `Zombie` local chamado `myZombie` (que será um ponteiro `storage`). Defina esta variável para ser igual ao index `_zombieId` em nossos array `zombies`.

Você terá 4 linhas de código até aqui, incluindo a linha com o fechamento `}`.

Continuaremos a seguir esta função no próximo capítulo!
