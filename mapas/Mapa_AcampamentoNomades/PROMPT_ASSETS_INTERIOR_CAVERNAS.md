# Interior das cavernas do Acampamento dos Nômades — prompt de assets

Duas cavernas (lugares de dentro): **Templo Soterrado** (`ts`) e **Gruta das Areias** (`ga`, hoje "Gruta do Arco Vermelho").

**Regra do Ricardo: pouca poluição.** Os salões são para caçar: o meio fica livre. Por isso a folha traz **poucas peças,
quase todas feitas para ficar encostadas na parede** (costas retas, viradas para a frente). Nada de entulho, pedrinhas ou
jarros para espalhar pelo chão. O jogo é plano: nada de escadas, rampas ou plataformas. Sem animais.

## Planta (esboços em `planta_templo.png` e `planta_gruta.png`)

- **Templo:** Entrada (acampamento) → Galeria de colunas (colunas nas paredes) → Salão do Ídolo (o ídolo na parede do
  fundo); dos lados da Galeria, dois **salões de caça** grandes e vazios.
- **Gruta:** Entrada → Galeria → dois **salões de caça** enormes (oeste e leste) → Câmara do Fundo, com o marco da gruta.

## Prompt 1: folha de objetos do interior (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **interior de cavernas no deserto: um templo antigo soterrado e uma gruta natural de arenito**, escuro, misterioso,
> iluminado por tochas.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada: arenito (#5a4232, #7a5a44,
> #9a7458, #b8906c, #d4ac84), areia (#a8834e, #c8a46a, #dcbc84), pedra calcária do templo (#8a7c68, #b0a48c, #d6ccb4),
> sombra quase preta (#1a120c, #2a1c14); cor saturada só em pequenos brilhos (fogo #f0a040, #ffd070; turquesa e ouro gastos
> nos relevos #2a8a80, #c8a040). Contorno escuro de 1 px, sombreamento detalhado, sem anti-aliasing borrado.
> **Cada objeto desenhado sozinho, SEM piso, tapete, areia ou plataforma embaixo, e nada de escadas, degraus ou rampas.**
> **As peças são feitas para ficar ENCOSTADAS NA PAREDE: costas retas, viradas de frente para quem olha.**
> **Nenhuma chama com brilho ou halo desenhado em volta** (o jogo faz o brilho). **Nenhum animal, osso ou crânio.**
> Cada objeto separado, bem afastado dos outros, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **Templo:** o **ídolo** — estátua sentada de um rei antigo, enorme (cerca de 8 tiles de largura e 10 de altura), encostada
>   na parede, meio coberta de areia; **coluna** de pedra calcária com capitel esculpido (inteira e quebrada ao meio);
>   **trecho de parede com relevos** pintados desbotados; **braseiro de pedra** com fogo; **estátua de guardião** com lança,
>   de frente (cerca de 3 tiles de largura e 5 de altura); **porta selada** de pedra com relevo;
> - **Gruta:** **formação de rocha** de arenito em camadas encostada na parede (2 tamanhos); **estalagmite** alta
>   (cerca de 3 tiles de altura); **cristal âmbar** grande brilhando saindo da rocha; **o marco da gruta**: um poço natural
>   de areia escorrendo de uma fenda do teto, com um feixe de luz fraca (cerca de 5 tiles de largura);
> - **Tumba do Rei:** **sarcófago dourado** de um rei antigo (cerca de 6 tiles de largura e 5 de altura) sobre um
>   pedestal de pedra, pintado com faixas azuis, a tampa com o rosto do rei **meio aberta** e um brilho quente saindo de
>   dentro (sem halo fora); **nicho funerário** para encostar na parede: moldura de pedra com uma **múmia enfaixada** deitada
>   dentro (cerca de 3 tiles de largura e 2 de altura, 2 variações); **estátua de servo ajoelhado** de pedra com toucado
>   listrado, de frente (cerca de 2 tiles de largura e 3 de altura); **vasos canópicos** (4, com tampas de cabeças humanas);
> - **Luz:** **tocha de parede** num suporte de ferro (esta é a peça mais usada; desenhe 2 variações);
> - **Exploradores** (só na entrada): saco de dormir enrolado, caixote aberto, lampião, picareta e pá encostadas.

## Prompt 2: atlas do chão e das paredes (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para o **interior de cavernas no deserto**,
> com a mesma paleta e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: chão de arenito liso com pouco
> cascalho; areia acumulada com ondulações; lajes antigas de pedra calcária com rejunte e areia por cima (planas, vistas de
> cima); a **face de uma parede de caverna** de arenito em camadas vista de frente (com o topo escuro acima dela); a face de
> uma parede de templo de blocos de pedra com friso esculpido; transição entre lajes e areia.

## Como o Claude usa

- O chão e as paredes continuam gerados no código (pintor JS + shader), com as cores do atlas e paredes mais altas.
- Os objetos entram fiéis à folha (recortados, 128 cores), **encostados nas paredes**, colisão só no pé.
- Os salões de caça ficam **vazios no meio**: só tochas e uma ou outra formação de rocha na beirada.
- Guarde as duas imagens em `Assets_Nomades\` (`folha_interior` e `atlas_interior`).
