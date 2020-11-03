---
title: Panoramica della Lezione
actions: ['checkAnswer', 'hints']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Nella Lezione 1 costruirai una "Fabbrica di zombi" per costruire un esercito di zombi.

* La nostra fabbrica manterrà un database di tutti gli zombi del nostro esercito
* La nostra fabbrica avrà una funzione per creare nuovi zombi
* Ogni zombi avrà un aspetto casuale ed unico

Nelle lezioni successive aggiungeremo più funzionalità, come dare agli zombi la capacità di attaccare gli umani o altri zombi! Ma prima di arrivarci dobbiamo aggiungere le funzionalità di base per creare nuovi zombi.

## Come funziona il DNA Zombie

L'aspetto dello zombi si baserà sul suo "DNA di zombi". Il DNA di zombi è semplice: è un numero intero di 16 cifre, come:

```
8356281049284737
```

Proprio come il vero DNA, alcune parti di questo numero verranno mappate su diverse caratteristiche. Le prime 2 cifre corrispondono al tipo di testa dello zombi, le seconde 2 cifre agli occhi dello zombi, ecc.

> Nota: per questo tutorial abbiamo mantenuto le cose semplici, i nostri zombi possono avere solo 7 diversi tipi di teste (anche se 2 cifre consentono 100 possibili opzioni). In seguito potremmo aggiungere più tipi di testa se volessimo aumentare il numero di varianti di zombi.

Ad esempio, le prime 2 cifre del nostro esempio di sopra del DNA sono "83". Per mapparlo sul tipo di testa dello zombi, facciamo `83 % 7 + 1` = 7. Quindi questo Zombi avrebbe il 7° tipo di testa zombi. 

Nel riquadro di destra vai avanti e sposta il cursore `Gene della Testa` sulla 7° testa (il cappello di Babbo Natale) per vedere a quale tratto corrisponderebbe l'`83`.

# Facciamo una prova

1. Gioca con i cursori sul riquadro destro della pagina. Sperimenta per vedere come i diversi valori numerici corrispondono a diversi aspetti dello zombi.

Ok, basta giocare. Quando sei pronto per continuare, premi "Capitolo Successivo" di seguito e tuffiamoci nell'apprendimento di Solidity!
