# Acampamento dos Nômades — id proposto `nd`

- **Nome:** Acampamento dos Nômades
- **Id:** `nd` (não está na lista dos ids usados)
- **Tamanho:** 150 × 120 tiles (2400 × 1920 px), área aberta padrão
- **Região:** Deserto (D)
- **Onde encaixa:** **a oeste de Al-Sahrah (`dq`)**, posição **(-130, 640)** no Mapa do Mundo (Al-Sahrah está em (20, 640)).
- **Gerador:** `acampamento_nomades.js`, função `nomadCamp()`. Feito sobre `exemplo_deserto/deserto_exemplo.js`: o pintor do
  chão, o `ds5b` e o ajudante da arte (`aNear`/`aScat`/`aBox`...) são **cópia exata**; mudam só a grade (dunas, estrada,
  clareiras, bordas), as zonas, os objetos e as passagens.
- **Chão:** `nd_floor.gdshader` = `dx_floor.gdshader` do kit com **uma mudança, pedida pelo Ricardo: as paredes de areia
  (encosta das dunas altas, `M = 2`) são mais altas** — `fh = 34 + vn·12` px em vez de `16 + vn·10` (e o laço que acha a
  encosta vai até 48 px em vez de 40). A mesma mudança está no pintor de `acampamento_nomades.js`; o resto do pintor e o
  `ds5b` são cópia exata. Precisa de `gen_common.gdshaderinc` e `ds_post.gdshaderinc`. Conferido no Godot 4.7.2:
  **99,99 %** dos pixels com diferença ≤ 2 em relação à `floor_ref.png`, PSNR **55,9 dB**.
- **Efeitos:** `fx_nd.gd` = `fx_dx.gd` do kit (`extends "res://scripts/fx_sand.gd"`), sem mudança no código.

## Pedido do Ricardo: **sem animais**

Nada de bichos vivos, de abutres no céu (`fx.bird` fica vazio) nem de ossadas de animais (crânios, esqueleto de camelo).

## Passagens

| Borda | Faixa | Leva para | Gatilho |
|---|---|---|---|
| **Leste** | linhas **46-54** (9 tiles, o padrão do Deserto) | Al-Sahrah (`dq`) | `{k:'edge', m:'dq', x:24, dy:0}` |

**Em Al-Sahrah é preciso abrir um portão na muralha oeste, na mesma faixa (linhas 46-54 da borda oeste)**, deslocamento 0.
O Ricardo escolheu essa ligação (a cidade é murada e hoje não tem saída para o oeste).
Norte, sul e oeste são fechados (dunas altas, `M = 2`).

## Áreas (zonas)

| # | Zona | Onde |
|---|---|---|
| 0 | Dunas do Oeste | o resto do mapa |
| 1 | Estrada de Al-Sahrah | a estrada de lajes, do portão (leste) até o acampamento |
| 2 | Círculo das Tendas | em volta de (60, 58): a tenda do chefe ao norte, o tapete dele estendido na frente (no `ov`), a fogueira grande com o caldeirão no meio, almofadas e banquinhos em volta, 5 tendas da tribo em roda, estandartes, lanternas, varal, tear e tapetes enrolados |
| 3 | Poço da Tribo | em volta de (38, 82): o poço com toldo, o cavalete dos odres, a fogueira pequena com o bule, a mesa do chá e almofadas |
| 4 | Mercado da Tribo | em volta de (92, 84): a barraca de especiarias, os odres, duas carroças, mercadorias e uma lanterna |
| 5 | Mirante das Dunas | em volta de (52, 24): o marco de pedras, a flâmula da tribo e um rochedo |
| 6 | Planície Escaldante | **área de caça**, em volta de (116, 99), raio 17: seca e aberta, 3 árvores mortas, mato seco e pedrinhas (sem colisão), rochedos baixos na beirada |
| 7 | Vale das Areias Vermelhas | **área de caça**, em volta de (116, 24), raio 15: anel de rochedos vermelhos grandes em volta, cascalho vermelho no meio |
| 8 | Campos do Vento | **área de caça**, em volta de (20, 46), raio 14: dunas baixas soltas formando corredores, mato seco rolando, 3 redemoinhos |
| 9 | Entrada do Templo Soterrado | entrada de caverna de areia com o portal esculpido (`cave_temple`, folha_cavernas), no pé do morro de areia, com lajes, capim seco e dois barris em volta |
| 10 | Gruta do Arco Vermelho | entrada de caverna de arenito cor de areia (`cave_sand`, folha_cavernas), encostada na parede de areia do norte (o Ricardo trocou a vermelha pela cor de areia) |

`gen_data`: R = chão, G = `RDD` × 10, B = `M` + zona × 16 (como o exemplo do Deserto).

## Cavernas (lugares de dentro)

| Porta (tiles) | Peça | Leva para | Chega em (px) |
|---|---|---|---|
| (121-124, 87), na boca | `cave_temple` | Templo Soterrado (`ts`) | (968, 1360) = tile (60, 85) |
| (111-115, 12), na boca | `cave_sand` | Gruta do Arco Vermelho (`ga`) | (968, 1360) = tile (60, 85) |

- As portas vêm no **campo extra `doors`** do gerador (`[{m, cells:[x,y, x,y,...], x, y}]`): o kit não traz o formato da
  porta do jogo. O Claude do jogo liga no formato do jogo.
- O vão escuro das duas entradas é pintado no `ov` (embaixo da peça). Atrás de cada entrada há duna alta (`M = 2`), então o
  jogador não passa por trás.
- Cada caverna sai pela borda sul e volta para a frente da porta: Templo → tile (122, 89); Gruta → tile (112, 14).
- As duas cavernas têm pasta própria (`Mapa_TemploSoterrado/`, `Mapa_GrutaArcoVermelho/`) com o `MAPA.md` delas.

## Entradas das cavernas (folha_cavernas)

- Folha `Assets_Nomades/folha_cavernas.png` (prompt `PROMPT_ASSETS_CAVERNA_AREIA.md`), registro `pecas_folha_cavernas.json`.
- Cada entrada é dividida em 3 partes (a peça da folha vinha com a areia desenhada embaixo): `<peça>_chao` vai para o `ov`
  (a areia do funil, retingida com a paleta do chão do Deserto), `<peça>_fundo` é o objeto da pedra em volta da boca (base na
  linha da boca) e `<peça>_frente` é o objeto das pedrinhas dos lados do funil (base na borda de baixo). Geometria (boca e
  corte) em `arte/info_cavernas.json`.
- Porta: os tiles da boca (Templo: (121-124, 87); Gruta: (111-115, 12)). Colisão: a pedra em volta da boca e as pedrinhas
  dos lados; o meio do funil é livre. Uma luz quente (`dark`) acende na boca à noite.
- Não usados (pedido do Ricardo, sem animais): o crânio e as costelas da folha. O portal antigo (`ruin_gate`) e o arco de
  pedra saíram.

## Luzes (`dark`) e efeitos (`fx`)

- **Luzes:** as 2 fogueiras (Círculo das Tendas e Poço), raio 110, força 1; e as lanternas de latão dos 3 postes
  (2 lanternas em cada, raio 64, força 0,8).
- **`fx.fire`:** o fogo das 2 fogueiras.
- **`fx.devil`:** 7 redemoinhos de poeira (3 nos Campos do Vento, 1 em cada outro campo de caça, 2 soltos).
- **`fx.bird`:** vazio (sem abutres). `fx.flag`: vazio (os estandartes e a flâmula já têm o pano desenhado na arte).
- Mais o vento com areia e o ar quente do `fx_sand.gd`, como nos outros mapas do Deserto.

## Colisão das pedras

- Pedras pequenas, pedrinhas, cascalho e lajinhas (`rock_s`, `rock_red`, `rock_red2`, `pebbles1/2`, `stones_s`,
  `rocks_small`, `rock_flat2`): **sem colisão** (o jogador passa por cima), pedido do Ricardo.
- Rochedos médios e grandes (`rock_m`, `rock_tall`, `rock_big`) e as lajes grandes (`slab1/2`): colisão só no pé.
- Áreas de caça: poucos enfeites, só na beirada; o meio de cada campo fica livre.

## Destinos sugeridos para o teleporte (tiles, livres)

- **Portão Oeste de Al-Sahrah:** (140, 50)
- **Círculo das Tendas:** (60, 67), logo ao sul da fogueira
- **Planície Escaldante** (caça): (116, 99)

## Arte

- **Folha da tribo** (nova): `Assets_Nomades/folha_nomades.png` (original do Ricardo) e o prompt `PROMPT_ASSETS_NOMADES.md`.
  `Assets_Nomades/folha_nomades_corte.png` é uma cópia com uma linha de fundo entre a tenda turquesa e a clara (as estacas
  das cordas se encostavam); o recorte é feito dela. Registro: `pecas_folha_nomades.json` (o "pixel" dessa folha tem ~3 px,
  por isso os fatores são menores que os do kit).
- **Peças do kit** (`exemplo_deserto/arte/`): rochedos, cactos, estrada, carroças, mercadorias, jarros, marco de pedras.
  Registro: `pecas_folha_ruinas.json` e `pecas_folha_caravanas.json` (copiados do kit).
- `arte/`: só as peças usadas, das duas origens (no máximo 128 cores). O **tapete do chefe** (`chief_rug`) é desenhado no
  `ov` (plano, o jogador anda por cima).
- **Tendas:** as da primeira folha da tribo (redondas, com franjas) **saíram**: o Ricardo achou que pareciam de circo.
  Por enquanto as tendas são a `tent` do kit (beduína, cor de areia). Há um prompt de tendas novas
  (`PROMPT_ASSETS_TENDAS.md`); se a folha vier, as tendas são trocadas.
- Entradas das cavernas: `ruin_gate` e `rock_arch` do kit. O estandarte rasgado, o poço e a fogueira do kit não são usados.
