---
title: Listas
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

          // comece aqui

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

      }
---

Quando você quer uma lista de algo, você pode usar um ***array*** (lista). Existem dois tipos de arrays (listas) em Solidity: ***fixed*** (fixo) arrays e ***dynamic*** (dinâmico) arrays:

```
// Array com tamanho fixo de 2 elementos:
uint[2] fixedArray;

// Outro array fixo, pode conter 5 strings:
string[5] stringArray;

// Um array dinâmico - não tem tamanho fixo, e pode continuar aumentando:
uint[] dynamicArray;
```

Você também pode criar um array de ***structs*** (Estruturas). Usando a estrutura `Person` do capítulo anterior.

```
Person[] people; // Array dinâmico, podemos continuar adicionando
```

Você lembra que variáveis de estado são guardadas permanentemente na blockchain? Então criar um array dinâmico de structs pode ser útil para guardar dados estruturados em seu contrato, como um tipo de banco de dados.

## Arrays públicos


Você pode declarar um array como `public` (público), e Solidity vai automaticamente criar um método ***getter*** para ele. A sintaxe fica assim:

```
Person[] public people;
```

Outros contracts poderão ler (mas não escrever) este array. Isso é um padrão útil para guardar dados públicos em seu contrato.

# Vamos testar

Nós queremos armazenar um exército de zumbis em nosso aplicativo. E queremos mostrar todos os nossos zumbis para outros aplicativos, então queremos que seja público.


1. Crie um array público de `Zombie` ***structs***, e nomei-o como `zombies`