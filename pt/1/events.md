---
title: Eventos
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          // declare o nosso evento aqui

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
              // dispare o evento aqui
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
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

          function _createZombie(string _name, uint _dna) private {
              uint id = zombies.push(Zombie(_name, _dna)) - 1;
              NewZombie(id, _name, _dna);
          } 

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

          function createPseudoRandomZombie(string _name) public {
              uint randDna = _generatePseudoRandomDna(_name);
              _createZombie(_name, randDna);
          }

      }
---

Nosso contrato esta quase terminado! Agora vamos adicionar um **_evento_**.

**_Eventos_** são as maneiras dos seus contratos comunicarem que algo aconteceu na blockchain para o seu aplicativo em um frontend, que pode `ouvir` por certos tipos de eventos e tomar ações quando algo acontecer.

Exemplo:

```
// Declarando o evento
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // Dispare um evento e deixe o aplicativo saber que a função foi chamada:
  IntegersAdded(_x, _y, result);
  return result;
}
```

O seu aplicativo frontend poderá então ouvir o evento. Uma implementação em JavaScript ficaria assim:

```
YourContract.IntegersAdded(function(error, result) {
  // Faça algo com o resultado
}
```

# Vamos testar

Queremos um evento que avise o frontend toda vez que um novo zumbi for criado, então o aplicativo pode mostrá-lo.

1. Declare um `event` chamado `NewZombie`. Este deve passar os parâmetros `zombieId` (um `uint`), `name` (uma `string`), e `dna` (um `uint`).

2. Modifique a função `_createZombie` para disparar o evento `NewZombie` após adicionar o novo Zumbi em nosso array `zombies`

3. Você vai precisar do `id` do zumbi. O `array.push()` retorna um `uint` com o novo tamanho do array - e desde que o primeiro item no array tem o index 0, `array.push() - 1` vai ser o index do zumbi que acabamos de adicionar. Guarde o resultado do `zombies.push() -1` em um `uint` chamado `id`, então você pode usá-lo no evento `NewZombie` na próxima linha.
