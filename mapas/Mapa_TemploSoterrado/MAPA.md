# Templo Soterrado — id proposto `ts` (lugar de dentro)

- **Nome:** Templo Soterrado
- **Id:** `ts` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro** (caverna) do Acampamento dos Nômades (`nd`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** **160 × 120 tiles** (2560 × 1920 px; aumentado a pedido do Ricardo para ter 6 salões de caça). O `preview.py` dá
  "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `templo_soterrado.js`, função `buriedTemple()`. As duas cavernas do Acampamento saem do mesmo molde
  (`visualizador_ferramentas/gera_cavernas.py` no repositório): mesmo pintor, mesmo shader, cores próprias.
- **Chão:** `ts_floor.gdshader`, porte linha a linha do pintor de caverna (o kit não tem chão de caverna do Deserto; o
  pintor do Deserto é de área aberta). Usa só `gen_common.gdshaderinc`. Conferido no Godot 4.7.2 contra a `floor_ref.png`:
  **99,999 %** dos pixels com diferença ≤ 2, PSNR **74-76 dB**.
- **`gen_data`:** R = andável, G = distância até o caminho principal × 10, B = tipo × 40 (0 chão de arenito com cascalho,
  1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto).
- **Efeitos:** `fx_ts.gd` (`extends "res://scripts/fx_base.gd"`): poeira flutuando, areia escorrendo do teto, fogo da
  fogueira (`fx.fire`, igual ao `fx_dx.gd`) e brilho das lanternas (`fx.lamp`).
- **Sem animais:** nada de bichos nem ossadas (pedido do Ricardo).

## Entrada e saída

- **Entra:** pela entrada de caverna com o portal esculpido (`cave_temple`), no morro de areia ao norte da Planície Escaldante, tiles (121-124, 87) do Acampamento dos Nômades. Chega aqui em **Salão da Entrada (60, 115)** (px: 968, 1840).
- **Sai:** pela **borda sul, colunas 56-63** (8 tiles): `{k:'edge', m:'nd', x, y}` — volta para o Acampamento na frente da
  porta, no tile (122, 89). O gatilho leva `x` **e** `y` (é a volta de uma porta, não uma passagem entre mapas abertos).
- O formato da porta no jogo não está no kit: no Acampamento ela vem no campo extra `doors` do gerador (tiles, destino e
  ponto de chegada). O Claude do jogo liga no formato do jogo.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Templo Soterrado (túneis) | |
| 1 | Salão da Entrada (60, 110) | acampamento dos exploradores encostado na parede (fogueira, mercadorias, jarro) |
| 2 | Galeria das Colunas (60, 86) | colunas encostadas nas paredes, o meio largo e livre |
| 3 | Salão do Ídolo (60, 42) | a cabeça da estátua na parede do fundo, dois obeliscos na parede de trás |
| 4 | Câmara Selada (60, 14) | câmara pequena atrás do Salão do Ídolo |
| 5 | Salão Desmoronado Oeste (22, 88), **caça** | grande e vazio no meio; só tochas na parede |
| 6 | Cripta Oeste (22, 46), **caça** | idem |
| 7 | Salão Desmoronado Leste (104, 92), **caça** | idem |
| 8 | Cripta Leste (104, 52), **caça** | idem |
| 9 | Salão das Areias (143, 72), **caça** | idem, o mais a leste |
| 10 | Galeria Norte (106, 15), **caça** | idem, ligada à Câmara Selada |

## Planta (pedido do Ricardo: pouca poluição)

Salões largos; o meio de cada salão fica livre para caçar e os enfeites ficam só encostados nas paredes.
A arte do interior vai ser trocada pela folha nova (`PROMPT_ASSETS_INTERIOR_CAVERNAS.md`) quando ela chegar.

## O que tem no templo (sem atrapalhar a caça)

- **Areia escorrendo do teto** nos 6 salões de caça: fios de areia caindo de fendas na parede de cima (`fx.sand`) e um
  montinho de areia no chão embaixo (no `ov`, sem colisão).
- **Braseiros de pedra** com fogo (no lugar dos postes de lanterna dos exploradores, que ficam só no Salão da Entrada):
  dois nos cantos de cima de cada salão de caça, dois na Galeria e dois no Salão do Ídolo (`fx.fire` + `dark`).
- **Guardiões** dos dois lados da passagem para o Salão do Ídolo (provisório: obeliscos; a estátua de guardião com lança
  está no `PROMPT_ASSETS_INTERIOR_CAVERNAS.md`).
- **O tesouro na Câmara Selada**: a porta selada com relevo na parede do fundo (provisório: `ruin_wall`), jarros e
  mercadorias dos lados e moedas de ouro espalhadas no chão (no `ov`, sem colisão).
- **Raio de luz** caindo do teto sobre o ídolo, com poeira brilhando (`fx.beam`, desenhado na camada de luz).

## Luzes (`dark`)

A caverna é escura: 1 fogueira (raio 140) e as lanternas (raio 120) iluminam os salões e os túneis.

## Destinos sugeridos para o teleporte

- **Salão da Entrada (60, 112)**
- **Salão do Ídolo (60, 46)**

## Arte

Só peças prontas do kit (`exemplo_deserto/arte/`), em `arte/`: column, column_broken, statue_head, obelisk, ruin_wall, jar, jar_broken, shard, goods, firepit, lamppost, rochedos e pedrinhas. Registro: `pecas_folha_ruinas.json` e
`pecas_folha_caravanas.json` (copiados do kit).

Os 6 salões de caça são ligados em anel pelos dois lados do eixo do templo (dá para circular sem voltar à entrada).
