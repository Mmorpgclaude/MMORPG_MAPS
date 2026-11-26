# Acampamento dos Nômades — id proposto `nd`

- **Nome:** Acampamento dos Nômades
- **Id:** `nd` (não está na lista dos ids usados)
- **Tamanho:** 150 × 120 tiles (2400 × 1920 px), área aberta padrão
- **Região:** Deserto (D)
- **Onde encaixa:** **a oeste de Al-Sahrah (`dq`)**, posição **(-130, 640)** no Mapa do Mundo (Al-Sahrah está em (20, 640)).
- **Gerador:** `acampamento_nomades.js`, função `nomadCamp()`. Feito sobre `exemplo_deserto/deserto_exemplo.js`: o pintor do
  chão, o `ds5b` e o ajudante da arte (`aNear`/`aScat`/`aBox`...) são **cópia exata**; mudam só a grade (dunas, estrada,
  clareiras, bordas), as zonas, os objetos e as passagens.
- **Chão:** `nd_floor.gdshader` = `dx_floor.gdshader` do kit **sem nenhuma mudança** (precisa de `gen_common.gdshaderinc` e
  `ds_post.gdshaderinc`). Conferido no Godot 4.7.2: **99,99 %** dos pixels com diferença ≤ 2 em relação à `floor_ref.png`,
  PSNR **55,9 dB**.
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

`gen_data`: R = chão, G = `RDD` × 10, B = `M` + zona × 16 (como o exemplo do Deserto).

## Luzes (`dark`) e efeitos (`fx`)

- **Luzes:** as 2 fogueiras (Círculo das Tendas e Poço), raio 110, força 1; e as lanternas de latão dos 3 postes
  (2 lanternas em cada, raio 64, força 0,8).
- **`fx.fire`:** o fogo das 2 fogueiras.
- **`fx.devil`:** 4 redemoinhos de poeira.
- **`fx.bird`:** vazio (sem abutres). `fx.flag`: vazio (os estandartes e a flâmula já têm o pano desenhado na arte).
- Mais o vento com areia e o ar quente do `fx_sand.gd`, como nos outros mapas do Deserto.

## Destinos sugeridos para o teleporte (tiles, livres)

- **Portão Oeste de Al-Sahrah:** (140, 50)
- **Círculo das Tendas:** (60, 62)

## Arte

- **Folha da tribo** (nova): `Assets_Nomades/folha_nomades.png` (original do Ricardo) e o prompt `PROMPT_ASSETS_NOMADES.md`.
  `Assets_Nomades/folha_nomades_corte.png` é uma cópia com uma linha de fundo entre a tenda turquesa e a clara (as estacas
  das cordas se encostavam); o recorte é feito dela. Registro: `pecas_folha_nomades.json` (o "pixel" dessa folha tem ~3 px,
  por isso os fatores são menores que os do kit).
- **Peças do kit** (`exemplo_deserto/arte/`): rochedos, cactos, estrada, carroças, mercadorias, jarros, marco de pedras.
  Registro: `pecas_folha_ruinas.json` e `pecas_folha_caravanas.json` (copiados do kit).
- `arte/`: só as peças usadas, das duas origens (no máximo 128 cores). O **tapete do chefe** (`chief_rug`) é desenhado no
  `ov` (plano, o jogador anda por cima).
- As tendas rasgadas, o estandarte rasgado, o poço e a fogueira do kit não são usados: a tribo é viva.
