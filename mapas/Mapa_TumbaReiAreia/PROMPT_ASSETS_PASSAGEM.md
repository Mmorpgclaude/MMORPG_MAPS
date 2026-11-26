# Passagem do Templo Soterrado para a Tumba do Rei da Areia — prompt de asset

Uma peça só: a **boca natural de caverna** na parede norte da Galeria Norte do Templo Soterrado, no estilo da imagem de
referência do Ricardo (colunas de pedras arredondadas, arco de pedras, pontas de rocha no teto da abertura e luz quente lá
dentro). Ela fica encostada na parede de rocha; o jogador anda até a boca escura e passa para a Tumba (é uma porta; o jogo
é plano).

## Prompt (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **entrada natural de caverna dentro de um templo soterrado no deserto**, escura e misteriosa.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada: pedra arenito
> (#4a3424, #6a4e36, #8a6a4c, #a8825e, #c8a47a), sombra quase preta (#140c08, #2a1a12); cor saturada só no brilho quente
> lá dentro da boca (#c86a20, #f0a040, #ffd070). Contorno escuro de 1 px, sombreamento detalhado, sem anti-aliasing borrado.
> **A peça é a boca de uma caverna aberta numa parede de rocha, vista de frente e de cima**: uma abertura escura em arco
> (cerca de 3 tiles de largura e 3,5 de altura) com **pontas de rocha pequenas pendendo do alto**; dos dois lados,
> **colunas de pedras arredondadas e irregulares empilhadas**; por cima, **pedras formando o arco**; e saindo para os lados,
> um **barranco de pedras menores** encostado na parede (a peça inteira com cerca de 9 tiles de largura e 5 de altura).
> Lá no fundo da boca, um **brilho quente alaranjado** fraco, como uma tocha distante.
> **Sem chão, areia ou piso desenhado embaixo da peça** (a base reta, terminando no fundo liso), **nada de escadas,
> degraus ou rampas**, **nenhum brilho ou halo desenhado fora da boca** e **nenhum animal**.
> Desenhe **duas variações** da mesma entrada (uma com mais pedras soltas na base, outra mais limpa), bem separadas, sobre
> fundo cinza-escuro liso, alinhadas a uma grade de 16 px. Separadas delas, **4 pedras arredondadas soltas** de tamanhos
> diferentes (para espalhar no chão perto da entrada).

## Como o Claude usa

- A peça entra na parede norte da Galeria Norte do Templo (tiles da porta (105-107, 6)); a boca escura é a porta para a
  Tumba do Rei da Areia (`tr`).
- Colisão só nas colunas de pedra dos lados; a boca fica livre.
- As pedras soltas vão no chão em volta, com colisão no pé, sem fechar o caminho até a boca.
- Guarde a imagem em `Assets_Tumba\` (`folha_passagem`).
