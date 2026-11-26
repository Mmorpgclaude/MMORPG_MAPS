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
| 2 | Círculo das Tendas | em volta de (60, 58): 7 tendas em roda, a fogueira grande no meio, estandartes, mercadorias e jarros |
| 3 | Poço da Tribo | em volta de (38, 82): o poço, jarros, cactos e uma fogueira pequena |
| 4 | Parada das Carroças | em volta de (92, 84): duas carroças, mercadorias e uma tenda |
| 5 | Mirante das Dunas | em volta de (52, 24): o marco de pedras, um estandarte e um rochedo |

`gen_data`: R = chão, G = `RDD` × 10, B = `M` + zona × 16 (como o exemplo do Deserto).

## Luzes (`dark`) e efeitos (`fx`)

- **Luzes:** as 2 fogueiras (Círculo das Tendas e Poço), raio 110, força 1.
- **`fx.fire`:** o fogo das 2 fogueiras.
- **`fx.devil`:** 4 redemoinhos de poeira.
- **`fx.bird`:** vazio (sem abutres). `fx.flag`: vazio (os estandartes já têm o pano desenhado na arte).
- Mais o vento com areia e o ar quente do `fx_sand.gd`, como nos outros mapas do Deserto.

## Destinos sugeridos para o teleporte (tiles, livres)

- **Portão Oeste de Al-Sahrah:** (140, 50)
- **Círculo das Tendas:** (60, 62)

## Arte

- **Nenhuma folha nova:** sem animais, tudo saiu das 62 peças prontas do kit (`exemplo_deserto/arte/`). Não há
  `PROMPT_ASSETS` nem folhas originais para este mapa.
- `arte/`: só as 28 peças usadas (cópia das do kit). `pecas_folha_ruinas.json` e `pecas_folha_caravanas.json`: o registro
  dessas peças, copiado do kit.
