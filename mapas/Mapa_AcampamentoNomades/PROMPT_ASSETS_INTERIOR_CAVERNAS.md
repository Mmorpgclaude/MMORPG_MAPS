# Interior das cavernas do Acampamento dos Nômades — prompt de assets

Duas cavernas (lugares de dentro), hoje na primeira versão (chão desenhado no código, poucas peças):
- **Templo Soterrado** (`ts`): um templo antigo engolido pela areia — salões de lajes, colunas, o salão do ídolo.
- **Gruta das Areias** (`ga`, hoje "Gruta do Arco Vermelho"): caverna natural de arenito cor de areia, combinando com a
  entrada nova — salões largos para caça.

O jogo é plano: nada de escadas, rampas, plataformas ou pontes por onde o jogador anda. Sem animais (pedido do Ricardo).
Duas folhas: a de objetos e o atlas (só referência de cor e textura do chão e das paredes).

## Prompt 1: folha de objetos do interior (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **interior de cavernas no deserto: um templo antigo soterrado e uma gruta natural de arenito**, escuro, misterioso,
> iluminado por tochas.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada, mais escura que a de fora:
> arenito (#5a4232, #7a5a44, #9a7458, #b8906c, #d4ac84), areia (#a8834e, #c8a46a, #dcbc84), pedra calcária do templo
> (#8a7c68, #b0a48c, #d6ccb4), sombra quase preta (#1a120c, #2a1c14); cor saturada só em pequenos brilhos (fogo das tochas
> e braseiros #f0a040, #ffd070; turquesa e ouro gastos nos relevos #2a8a80, #c8a040). Contorno escuro de 1 px,
> sombreamento detalhado, sem anti-aliasing borrado.
> **Cada objeto desenhado sozinho, SEM piso, tapete, areia ou plataforma embaixo, e nada de escadas, degraus ou rampas.**
> **Nenhuma chama com brilho ou halo desenhado em volta** (o jogo faz o brilho). **Nenhum animal, osso ou crânio.**
> Cada objeto separado, bem afastado dos outros, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **Templo:** o **ídolo** — estátua sentada de um rei antigo de pedra, enorme (cerca de 8 tiles de largura e 10 de
>   altura), meio coberta de areia; **colunas** de pedra calcária com capitel esculpido (inteira, quebrada ao meio, tombada
>   no chão); **trecho de parede com relevos** pintados desbotados (2 variações); **braseiro de pedra** alto com fogo;
>   **altar de oferendas** baixo com jarros e moedas; **sarcófago** fechado de pedra; **estátua de guardião** com lança
>   (cerca de 3 tiles de largura e 5 de altura); **porta selada** de pedra com relevo (só enfeite, encostada na parede);
>   **monte de entulho** de blocos do teto caídos (2 tamanhos); **jarros e ânforas** (inteiro, quebrado, tombado);
> - **Gruta:** **estalagmites** de arenito (3 tamanhos, do pequeno a um de 3 tiles de altura); **rochedos** de arenito em
>   camadas (3 tamanhos); **pilar natural** de rocha ligando chão e teto (só enfeite, colisão no pé); **monte de areia**
>   escorrido do teto; **raízes secas** pendendo de uma fenda; **cristais âmbar** brilhando saindo da rocha (2 tamanhos);
> - **Exploradores:** **tocha de parede** num suporte de ferro; **tocha de pé** num poste de madeira; **acampamento**
>   pequeno — saco de dormir enrolado, mochila, caixote aberto, lampião, corda enrolada, picareta e pá encostadas.

## Prompt 2: atlas do chão e das paredes (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para o **interior de cavernas no deserto**,
> com a mesma paleta e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: chão de arenito escuro com
> cascalho; areia acumulada com ondulações; lajes antigas de pedra calcária com rejunte e areia por cima; lajes rachadas e
> desniveladas (planas, vistas de cima); a **face de uma parede de caverna** de arenito em camadas vista de frente (com o
> topo escuro acima dela); a face de uma parede de templo de blocos de pedra com friso esculpido; transição entre lajes e
> areia.

## Como o Claude usa

- O chão e as paredes continuam gerados no código (pintor JS + shader), agora imitando as cores do atlas.
- Os objetos entram fiéis à folha (recortados, 128 cores, colisão só no pé).
- Os salões são redesenhados: Templo com eixo de colunas até o ídolo; Gruta com salões largos de caça e estalagmites só
  nas beiradas.
- Guarde as duas imagens em `Assets_Nomades\` (`folha_interior` e `atlas_interior`).
