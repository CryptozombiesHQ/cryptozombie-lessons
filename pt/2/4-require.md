---
title: Requerer (Require)
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
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
              // comece aqui
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
    answer: >
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
---

Na lição 1, possibilitamos os usuários de criar novos zumbis chamando a função `createPseudoRandomZombie` e colocando um nome. Porém, se os usuários continuarem chamando esta função e de forma ilimitada criando zumbis em seus exércitos, o jogo não teria tanta graça.

Vamos fazer assim, cada jogador só pode chamar esta função uma vez. Desta maneira novos jogadores irão chamar só quando começarem o jogo pela primeira vez, para criar o primeiro zumbi do exército.

Como podemos fazer esta função ser chamada somente uma vez por jogador?

Para isso nós vamos usar o `require` (requerer). `require` faz com que a função lance um erro e pare a execução se alguma condição não for verdadeira:

```
function sayHiToVitalik(string _name) public returns (string) {
  // Compara se _name é igual à "Vitalik". Lança um erro e termina se não for verdade.
  // (Lembrete: Solidity não tem uma forma nativa de comparar strings, então
  // temos que comparar os hashes keccak256 para verificar a igualdade)
  require(keccak256(_name) == keccak256("Vitalik"));

  // Se é verdade, prossiga com a função:
  return "Olá!";
}
```

Se você chamar esta função com `sayHiToVitalik("Vitalik")`, ela irá retornar "Olá!". Se você chamar esta função com outra entrada, ela irá lançar um erro e não irá executar.

Sendo assim, `require` é muito útil para verificar certas condições que devem ser verdadeiras antes de executar uma função.

# Vamos testar

Em nosso jogo de zumbi, nós não queremos que o usuário possa criar zumbis ilimitadamente em seus exércitos ao chamar a função `createPseudoRandomZombie` consecutivamente - acabaria com a graça do jogo.

Vamos usar o `require` para ter certeza que esta função só será executada uma vez por usuário, quando precisarem criar o primeiro zumbi.

1. Coloque uma declaração de `require` no começo da função `createPseudoRandomZombie`. A função deve checar para ter certeza que `ownerZombieCount[msg.sender]` é igual a `0`, e lançar um erro caso o contrário.

> Nota: Em Solidity, não importa qual o termo você usar primeiro - ambas as formas funcionam. Porém, desde que o nosso checador de resposta é bem básico, ele só aceita um tipo de resposta correta - ele espera que `ownerZombieCount[msg.sender]` esteja em primeiro.
