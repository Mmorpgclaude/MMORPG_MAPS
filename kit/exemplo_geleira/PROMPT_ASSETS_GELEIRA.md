# Mapa novo do Gelo: Geleira do Gigante Adormecido (id proposto `gj`)

Fica ao norte da Floresta dos Pinheiros (`nn`), a leste do Vale dos Lobos. Tamanho padrão 150×120.

- **Entrada:** só pela Floresta, seguindo o Rio Congelado (que hoje chega na borda norte da Floresta nas colunas ~88-96).
  A Floresta ganha uma passagem na borda norte (protocolo "não perder nada").
- **Oeste fechado** (sem passagem para o Vale). **Leste** preparado para uma passagem futura.

## O que tem no mapa

| Área | Onde | O que tem |
|---|---|---|
| **Vale do Rio** | sul, na entrada | o Rio Congelado subindo entre pinheiros esparsos e pedras, ponte de troncos |
| **Acampamento Abandonado** | meio-oeste | tendas rasgadas, caixotes, trenó quebrado, fogueira apagada, mapa preso num poste |
| **Campo de Fendas** | meio | fendas azuis no gelo atravessadas por pontes de gelo e de corda |
| **Machado e Elmo** | meio-leste | o machado e o elmo gigantes do jötunn caídos e meio enterrados na neve |
| **Paredão da Geleira** | norte | a parede de gelo com o **gigante adormecido** preso dentro e a **cachoeira congelada** onde o rio nasce |

À noite, **aurora boreal** no céu: é efeito animado, feito no código (`fx`), sem asset.
Sem combate, como os outros mapas.

## Prompt 1: folha de objetos (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **geleira nórdica da terra dos gigantes (Jotunheim)**, inverno claro e frio, épico mas não sombrio.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta fria e dessaturada: gelo azul-claro e
> ciano (#7eaad0, #a8cce6, #cfe6f6, #eef8ff), gelo profundo azul-escuro (#2a4e78, #3e6a96), neve branco-azulada
> (#dde8f4, #eef3fa), granito cinza-azulado (#424854 a #8e96a2), madeira escura envelhecida (#3e2a1a a #93704e);
> cor saturada só em pequenos brilhos. Contorno escuro de 1 px, sombreamento detalhado, sem anti-aliasing borrado.
> Cada objeto separado, sem sobrepor, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **O gigante adormecido:** um jötunn enorme (cerca de 14 tiles de largura e 12 de altura) preso dentro de uma parede de
>   gelo translúcido, visto de frente, olhos fechados, barba longa congelada, braços cruzados, armadura de couro e
>   peles; o gelo na frente dele com rachaduras e reflexos; neve no topo da parede;
> - **Parede da geleira:** trechos de paredão de gelo azul em camadas (reto, canto, ponta), com pingentes e neve no alto;
> - **Cachoeira congelada:** queda de gelo saindo do paredão (cerca de 4 tiles de largura e 6 de altura), com o rio
>   congelado começando no pé;
> - **Machado gigante** cravado inclinado na neve (cabo de madeira com tiras de couro, lâmina de ferro com runas),
>   **elmo gigante** com chifres caído de lado e meio enterrado, **escudo redondo gigante** rachado;
> - **Fendas e pontes:** ponte de gelo natural em arco, ponte de corda com tábuas, estacas de ancoragem com corda;
> - **Acampamento abandonado:** tenda rasgada com neve dentro, caixotes abertos, trenó quebrado, fogueira apagada com
>   pedras, poste com um mapa de couro pregado, picareta e corda de escalada no chão, mochila caída;
> - **Natureza:** pinheiros esparsos e baixos, cristais de gelo saindo do chão (3 tamanhos), blocos de gelo soltos,
>   pedras de granito com neve, ossos de animal grande meio enterrados;
> - **Ponte de troncos** sobre o rio congelado e uma **pedra rúnica alta** com runas azuis apagadas.

## Prompt 2: atlas do terreno (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para uma **geleira nórdica**, com a
> mesma paleta fria e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: neve fofa com relevo;
> neve dura e ventada com sulcos; gelo azul de geleira com camadas e bolhas; borda de fenda no gelo (vista de cima,
> descendo para um azul profundo escuro); rio congelado com rachaduras e neve nas margens; gelo liso escorregadio com
> reflexos; transição entre neve e gelo; rocha de granito com neve; topo do paredão de gelo visto de cima.

## Como o Claude usa

- O chão é gerado na placa de vídeo: o atlas serve de referência de cor e textura para o pintor JS e o shader.
- Os objetos entram no gerador novo, fiéis à folha.
- Guarde as duas imagens numa pasta `Assets_Geleira\` em `D:\Downloads\MMORPG\VIKING\VALDORIA\`.
