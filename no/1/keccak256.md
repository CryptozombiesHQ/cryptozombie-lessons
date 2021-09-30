---
title: Keccak256 og Typecasting
actions: ['checkAnswer', 'hints']
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
              // start her
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

Vi vil at funksjonen vår `_generatePseudoRandomDna` skal returnere en (semi) tilfeldig `uint`. Hvordan kan vi oppnå dette?

Ethereum har hash-funksjonen `keccak256` bygget inn, som er en versjon av SHA3. En hash-funksjon tar en input-string og gjør den om til et 256-bit hexadecimal nummmer. En liten endring i string-en vil gjøre at hele hashen blir endret.

Det er nyttig for mange formål i Ethereum, men akkuratt nå kommer vi til å bruke det bare for å lage et pseudo-tilfeldig nummer.

Eksempel:

```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```

Som du kan se,den returnerte verdien er helt annerledes fra den første selv bare med én bokstav-endring.

> Noter: **Sikker** tilfeldig nummer generering i blockchain er et veldig vanskelig problem. Vår metode her er usikker,men siden sikkerhet ikke er vår største prioritet i vårt Zombie DNA, er det godt nok for vårt bruk.

## Typecasting

Noen ganger kan det være greit å konvertere mellom data typer. Ta det følgende eksempelet:

```
uint8 a = 5;
uint b = 6;
// returnerer en feil fordi a * b returnerer som uint, ikke uint8:
uint8 c = a * b; 
// vi må typecaste b som en uint8 for å få det til å fungere:
uint8 c = a * uint8(b); 
```

Over, returneres `a * b` som `uint`, men vi prøver å lagre som  `uint8`, noe som potensielt kan gi oss problemer. Ved å caste som `uint8`, kompileres b som en uint8 og vi unngår problemer.

# Test det

La oss fylle inn funksjonen vår `_generatePseudoRandomDna`! Der er det du bør gjøre:

1. Den første linjen med kode bør ta `keccak256` hashen av `_str` for å generere et pseudo-tilfeldig hexadecimal, typecast den som en `uint`, og lagre til slutt resultatet som en `uint` kalt `rand`.

2. Vi vil at DNA-et vårt skal være 16 sifre langt (husker du `dnaModulus`-en vår?). Så andre linje med kode burde `return`-e verdien returnert over i  modulus (`%`) `dnaModulus`.
