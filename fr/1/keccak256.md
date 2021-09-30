---
title: Keccak256 et conversion de type
actions: ['vérifierLaRéponse', 'indice']
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              // commencez ici
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

          function _createZombie(string _name, uint _dna) private {
              zombies.push(Zombie(_name, _dna));
          }

          function _generatePseudoRandomDna(string _str) private view returns (uint) {
              uint rand = uint(keccak256(_str));
              return rand % dnaModulus;
          }

      }
---

Comment faire pour que notre fonction `_generatePseudoRandomDna` retourne un `uint` (presque) aléatoire ?

Ethereum a la fonction de hachage `keccak256` intégrée, qui est une variante de SHA3. Une fonction de hachage permet fondamentalement de lier une chaîne d'entrée à un nombre hexadécimal aléatoire de 256 bits. Le moindre changement dans la chaîne provoquera un grand changement dans le hachage.

Cela sert à beaucoup de chose pour Ethereum, mais pour l'instant nous allons simplement l'utiliser pour générer un nombre pseudo-aléatoire.

Exemple:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```
Comme vous pouvez le voir, les valeurs retournées sont complètement différentes alors qu'il y a seulement 1 caractère de changé à l'argument d'entrée.

> Remarque: La génération de nombres aléatoires **sécurisés** dans la blockchain est un problème très complexe. Notre méthode ici n'est pas sécurisée, mais comme la sécurité n'est pas la grande priorité de notre ADN Zombie, cela sera suffisant pour notre usage.

## Conversion de type


Il peut être utile de convertir des types de données. Prenons l'exemple suivant :

```
uint8 a = 5;
uint b = 6;
// renvoie une erreur car a * b renvoie un uint, pas un uint8:
uint8 c = a * b;
// Nous devons convertir le type de b en uint8 pour que cela marche :
uint8 c = a * uint8(b);
```

Ci-dessus, `a * b` renvoie un `uint`, mais nous essayons de le stocker comme un `uint8`, ce qui pourrait poser problème. En le convertissant en `uint8`, cela marche et le compilateur ne retourne pas d'erreur.

# A votre tour.

Complétons le corps de notre fonction `_generatePseudoRandomDna` ! Voila ce qu'elle devrait faire :

1. La première ligne de code doit prendre le hachage `keccak256` de `_str` pour générer un nombre pseudo-aléatoire hexadécimal, le convertir en un `uint`, et enfin stocker le résultat dans un `uint` nommé `rand`.

2. Nous allons vouloir que notre ADN fasse seulement 16 chiffres de long (vous vous rappelez notre `dnaModulus` ?). La deuxième ligne de code devra retourner la valeur ci-dessus modulo (`%`) `dnaModulus`.
