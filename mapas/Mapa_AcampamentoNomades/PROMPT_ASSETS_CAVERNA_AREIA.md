# Acampamento dos Nômades (`nd`) — prompt da entrada de caverna de areia

O Ricardo quer as entradas das cavernas (Gruta do Arco Vermelho e, se ficar bom, o Templo Soterrado) no estilo da imagem
de referência que ele mandou: uma **boca de caverna aberta no chão de areia**, com **camadas de pedra em degraus naturais
dos dois lados formando um funil**, a areia escorrendo para dentro e um **brilho quente lá no fundo**.
O jogo é plano: o chão do funil é areia plana (o jogador anda até a boca e entra pela porta); as pedras dos lados são
enfeite com colisão só no pé.

## Prompt: folha de entradas de caverna (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **entradas de cavernas abertas no chão do deserto**, naturais, misteriosas.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada do deserto: areia
> (#c8a46a, #dcbc84, #ecd6a4, #f6dca0), sombra da areia (#8a6a42, #a8834e), arenito em camadas (#7a5a44, #9a7458,
> #b8906c, #d4ac84), pedra escura das bordas (#4a3a34, #5e4a42), fundo da caverna quase preto (#140c08, #2a1a12);
> brilho quente só lá no fundo da boca (#c86a20, #f0a040, #ffd070). Contorno escuro de 1 px, sombreamento detalhado,
> sem anti-aliasing borrado.
> **Cada entrada é UMA peça**: a boca escura da caverna no meio, aberta para baixo da imagem (para o sul), e em volta dela
> **lajes e blocos de arenito em camadas, como degraus naturais de pedra empilhados**, formando um funil em forma de "U"
> aberto para a frente; a areia do deserto escorrendo entre as pedras para dentro da boca.
> **O chão na frente da boca é areia plana vista de cima, NADA de escadas, degraus de construção, rampa ou caminho
> descendo**: o efeito de profundidade fica só dentro da boca escura.
> **Sem chão desenhado em volta da peça** (as bordas de fora das pedras terminam no fundo liso), **sem brilho ou halo
> desenhado fora da boca** (o jogo faz o brilho) e **nenhum animal**.
> Cada peça separada, bem afastada das outras, sobre fundo cinza-escuro liso, alinhada a uma grade de 16 px. Peças:
> - **Entrada grande** de caverna (cerca de 12 tiles de largura e 9 de altura), funil largo de camadas de arenito, boca
>   escura com o brilho quente no fundo;
> - **Entrada média** (cerca de 9 tiles de largura e 7 de altura), mesma ideia, com arenito avermelhado (#8a4a34, #b06a48,
>   #d08a60) nas camadas, para uma gruta de rocha vermelha;
> - **Entrada de templo soterrado** (cerca de 11 tiles de largura e 8 de altura): o mesmo funil de pedra e areia, mas a boca
>   tem o topo de um portal antigo de pedra esculpida meio enterrado na areia;
> - **Soltos para enfeitar em volta:** 3 lajes de arenito tombadas, 2 montinhos de pedras, galhos secos, um barril velho
>   e um barril tombado (sem animais).

## Como o Claude usa

- A peça vai no lugar do arco de pedra (Gruta do Arco Vermelho) e, se o Ricardo gostar, do portal (Templo Soterrado).
- A porta continua na boca escura: o jogador anda pela areia plana do funil até ela.
- As camadas de pedra levam colisão só no pé (os dois lados do funil); o meio do funil fica livre.
- Guarde a imagem em `Assets_Nomades\` como `folha_cavernas`.
