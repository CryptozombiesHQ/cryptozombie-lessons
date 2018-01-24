---
title: Trabalhando com Estruturas (Structs) e Listas (Arrays)
actions: ['verificarResposta', 'dicas']
material:
  editor:
    language: sol
    startingCode: |
      pragma solidity ^0.4.19;

      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              // comece aqui
          }

      }
    answer: >
      pragma solidity ^0.4.19;


      contract ZombieFactory {

          uint dnaDigits = 16;
          uint dnaModulus = 10 ** dnaDigits;

          struct Zombie {
              string name;
              uint dna;
          }

          Zombie[] public zombies;

          function createZombie(string _name, uint _dna) {
              zombies.push(Zombie(_name, _dna));
          }

      }
---

### Criando novas Structs

Você lembra da nossa `Person` struct no exemplo anterior?

```
struct Person {
  uint age;
  string name;
}

Person[] public people;
```

Agora nós vamos aprender como criar uma nova `Person` e adiciona-lá ao nosso `people` array.

```
// criar uma nova Person:
Person satoshi = Person(172, "Satoshi");

// Adicionar a pessoa ao Array:
people.push(satoshi);
```

Nós também podemos combiná-los em uma única linha para ter um código limpo:

```
people.push(Person(16, "Vitalik"));
```

Perceba que o `array.push()` adiciona qualquer coisa no **fim** do array, então os elementos são adicionados em ordem conforme adicionamos. Veja o próximo exemplo:

```
uint[] numbers;
numbers.push(5);
numbers.push(10);
numbers.push(15);
// number agora é [5, 10, 15]
```

# Vamos testar

Vamos fazer a nossa função createZombie fazer algo!

1. Preencha o corpo da função para cirar um novo `Zombie`, e adicione nossa array `zombies`. O `name` e `dna` para o Zombie deve vir nos argumentos da função.
2. Vamos fazer isso em uma linha para manter o código claro.
