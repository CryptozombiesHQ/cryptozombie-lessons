---
title: Visão Geral da Lição
actions: ['verificarResposta', 'dicas']
skipCheckAnswer: true
material:
  saveZombie: false
  zombieResult:
    hideNameField: true
    ignoreZombieCache: true
    answer: 1
---

Na lição 1, você irá construir uma "Zombie Factory" (Fábrica de Zumbi) para construir um exército de zumbis.

* Nossa fábrica irá manter um banco de dados de todos os zumbis em nosso exército
* Nossa fábrica terá uma função para criar novos zumbis.
* Cada zumbi terá uma aparência única.

E furamente, nós iremos adicionar mais funcionalidades, como dar aos zumbis a habilidade de atacar humanos ou outros zumbis! Mas antes vamos adicionar a funcionalidade básica de criar novos zumbis.

## Como Funciona o DNA Zumbi

A aparência de um zumbi será baseada em seu "DNA Zumbi". DNA Zumbi é simples - é um inteiro de 16-dígitos, parecido com:

```
8356281049284737
```

E como um DNA real, diferentes partes deste número irão traçar diferentes características. Os 2 primeiros dígitos definem o tipo da cabeça do zumbi, os 2 dígitos seguintes são os olhos do zumbi, etc.

> Nota: Para este tutorial, nós iremos manter as coisas bem simples, e nossos zumbis terão somente 7 diferentes tipos de cabeças (mesmo que os 2 dígitos permitem até 100 diferentes opções). Mais tarde podemos adicionar mais tipos de cabeça se quisermos aumentar o número de variaçoes.

Por exemplo, os primeiros 2 dígitos do nosso exemplo de DNA acima são `83`. Para traçar o tipo de cabeça do zumbi, faremos `83 % 7 + 1` = 7. Então o Zumbi terá o 7ª tipo de cabeça.

No painel ao lado direito, vá em frente e tente mover o controle deslizante do `head gene` (gene da cabeça) para a 7ª cabeça (o chapéu de Papai Noel) para ver o que o traço `83` irá corresponder.

# Vamos testar

1. Brinque com os controles deslizantes no lado direito da página. Experimente para ver como os diferentes valores númericos correspondem à diferentes aspectos da aparência do zumbi.

Ok, chega de brincadeiras. Quando você estiver pronto, clique em "Next Chapter" (Próximo Capítulo) abaixo, e vamos mergulhar na aprendizagem de Solidity!
