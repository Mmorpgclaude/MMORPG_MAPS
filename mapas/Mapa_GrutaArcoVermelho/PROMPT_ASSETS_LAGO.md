# Lago Subterrâneo (área nova, lugar de dentro) + escada de corda — prompt de assets

Na **Câmara do Fundo** da Gruta (`ga`), uma **escada de corda e madeira** desce por uma fenda até o **Lago Subterrâneo**:
uma caverna enorme com um lago escuro no meio, ilhas de areia ligadas por passarelas planas e cristais âmbar na beira.
Muita área de caça: as margens largas em volta do lago e cinco salões ao redor (planta em `planta_lago.png`).

A escada é uma **porta**: o jogador anda até ela e troca de mapa (ninguém sobe ou desce de verdade; o jogo é plano).
O lago é **água funda** (não se anda); as passarelas são **planas, vistas de cima**, no nível do chão. Sem animais.
Pouca poluição: peças de encostar na parede ou na beira da água; o meio dos salões fica livre.

## Prompt 1: folha de objetos (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **lago subterrâneo escondido embaixo do deserto**, caverna enorme, silenciosa, iluminada por cristais âmbar e tochas.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta: arenito (#5a4232, #7a5a44, #9a7458, #b8906c),
> areia úmida (#8a6a48, #a8845a, #c4a070), água funda azul-esverdeada escura (#0e2232, #16344a, #22506a), reflexos claros
> (#5a9ab0, #a8d8e4); cor saturada só nos brilhos (cristais âmbar #d08a20, #f0b040, #ffe08a; fogo #f0a040).
> Contorno escuro de 1 px, sombreamento detalhado, sem anti-aliasing borrado.
> **Cada objeto desenhado sozinho, SEM piso, areia ou água desenhados embaixo, e nada de escadas de pedra, degraus ou
> rampas.** **Nenhuma chama nem cristal com brilho ou halo desenhado em volta** (o jogo faz o brilho). **Nenhum animal.**
> Cada objeto separado, bem afastado dos outros, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **Escada de corda e madeira — de cima:** a boca de uma fenda escura no chão (cerca de 4 tiles de largura) com duas
>   estacas de madeira cravadas na beira, a corda amarrada nelas e os primeiros degraus de madeira descendo para o escuro;
> - **Escada de corda e madeira — de baixo:** a mesma escada pendurada numa parede de rocha (cerca de 3 tiles de largura e
>   6 de altura), subindo até um buraco escuro no teto, com a ponta da corda enrolada no chão;
> - **Cristais âmbar** saindo da rocha, em 3 tamanhos (o maior com cerca de 3 tiles de altura); **aglomerado de cristais**
>   na beira da água;
> - **Estalagmites** de arenito úmido (2 tamanhos); **formação de rocha** em camadas para encostar na parede (2 tamanhos);
> - **Margem do lago:** pedras lisas e molhadas na beira da água (3 variações, para encostar na borda da água);
> - **Estátua antiga meio afundada** (o marco do lago): a cabeça enorme de um rei de pedra e um braço erguido saindo da
>   água (cerca de 6 tiles de largura e 5 de altura), com musgo e cristais âmbar pequenos presos na pedra; desenhe só a
>   parte fora da água, a linha da água reta embaixo (o jogo desenha as ondinhas em volta);
> - **Barco a remo** velho de madeira, amarrado (visto de cima, para ficar na água junto à margem);
> - **Píer pequeno** de madeira (plano, visto de cima, cerca de 3 tiles de comprimento);
> - **Tocha de pé** num poste de madeira; **tocha de parede** num suporte de ferro;
> - **Acampamento dos exploradores** (só na chegada): lampião, caixote, rolo de corda, saco de dormir.

## Prompt 2: atlas do chão e da água (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para um **lago subterrâneo embaixo do
> deserto**, com a mesma paleta e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: chão de arenito
> escuro; areia úmida da margem com marcas da água; a **borda da água** (areia molhada encontrando a água, vista de cima);
> água rasa clara perto da margem; água funda escura com reflexos e ondinhas; uma **passarela de tábuas plana** sobre a
> água, vista de cima; a face de uma parede de caverna de arenito úmido (com o topo escuro acima dela).

## Como o Claude usa

- Mapa novo (lugar de dentro), cerca de **180 × 140 tiles**, id proposto `lg`. Porta de entrada: a escada na Câmara do
  Fundo da Gruta (`ga`); saída: a escada de corda na chegada do Lago, de volta à Câmara do Fundo.
- O chão, a água e as paredes são gerados no código (pintor JS + shader), com as cores do atlas; as passarelas planas vão
  no `ov` (o jogador anda por cima).
- Os objetos entram fiéis à folha (recortados, 128 cores, colisão só no pé), encostados nas paredes e na beira da água.
- Guarde as duas imagens em `Assets_Lago\` (`folha_lago` e `atlas_lago`).
