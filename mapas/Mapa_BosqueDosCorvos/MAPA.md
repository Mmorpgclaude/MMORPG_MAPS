# Bosque dos Corvos Brancos — id proposto `lc`

- **Nome:** Bosque dos Corvos Brancos
- **Id:** `lc` (não está na lista dos ids usados)
- **Tamanho:** 150 × 120 tiles (2400 × 1920 px), área aberta padrão
- **Região:** Reino do Gelo (N)
- **Onde encaixa:** **ao norte do Passo de Hrimfjell (`nh`)**, posição **(110, -660)** no Mapa do Mundo
  (o Passo está em (110, -540)). Não há outros vizinhos.
- **Gerador:** `bosque_corvos.js`, função `ravenWood()`
- **Chão:** `lc_floor.gdshader` (porte do pintor). Conferido no Godot 4.7.2: **99,9985 %** dos pixels com diferença ≤ 2
  em relação à `floor_ref.png`, PSNR **60,2 dB**.
- **Efeitos:** `fx_lc.gd` (`extends "res://scripts/fx_frost.gd"`)

## Passagens

| Borda | Faixa | Leva para | Gatilho |
|---|---|---|---|
| **Sul** | colunas **70-80** (11 tiles) | Passo de Hrimfjell (`nh`) | `{k:'edge', m:'nh', y:24, dx:0}` |

**No Passo de Hrimfjell é preciso abrir a mesma faixa na borda norte (colunas 70-80)**, deslocamento 0. A faixa fica
alinhada com a saída sul do Passo (colunas 69-75), então o caminho atravessa o Passo quase em linha reta.
Oeste, norte e leste são fechados (paredão de rocha com mata morta densa).

## Áreas (zonas)

| # | Zona | Onde |
|---|---|---|
| 0 | Bosque dos Corvos Brancos | bordas e o norte aberto |
| 1 | Trilha do Passo | sul, a entrada (linhas 100-119) |
| 2 | Bosque Branco | o meio (linhas 40-99): árvores mortas brancas, manchas de chão do bosque, lagoa congelada |
| 3 | Ninhal | leste, em volta de (117, 62): árvores com ninho, ninhos no chão, corvos pousados, penas |
| 4 | Poço Sagrado | oeste, em volta de (31, 65): o poço com as pedras rúnicas e estacas de oferendas |
| 5 | Árvore dos Corvos | norte, em volta de (75, 33): a árvore gigante e o altar dos corvos |
| 6 | Cabana do Guardião | noroeste, em volta de (34, 35): a cabana abandonada, banco, tronco e toco |

Tipos de chão no `gen_data` (canal B ÷ 40): 0 neve, 1 chão do bosque, 2 trilha de terra congelada, 3 gelo escuro
(lagoa, andável), 4 rocha (bloqueado), 5 neve pisada.

## Luzes (`dark`) e efeitos (`fx`)

- **Luzes:** as 3 velas do altar (raio 56, força 0,9) e as 2 pedras rúnicas do Poço (raio 40, força 0,55).
- **`fx.mist`:** névoa baixa rolando no Bosque Branco.
- **`fx.raven`:** corvos voando em círculos em volta da Árvore (`[cx, cy, rx, ry, fase, velocidade]`).
- **`fx.feather`:** penas pretas caindo da Árvore e do Ninhal (`[x, y, fase]`).
- **`fx.candle`:** chamas das velas do altar (sem halo na arte; o brilho é do `glow`).
- **`fx.rune`:** runas do Poço pulsando em azul.
- **`fx.eyes`:** olhos amarelos piscando no escuro entre as árvores (só à noite) (`[x, y, fase]`).
- Mais a neve, a nevasca e a respiração do `fx_frost.gd`, como nos outros mapas do Gelo.

## Destinos sugeridos para o teleporte (tiles, livres)

- **Bosque dos Corvos — Entrada:** (75, 110)
- **Árvore dos Corvos:** (75, 37)

## Arte

- Folhas originais em `Assets_BosqueDosCorvos/` (`folha_objetos.png`, `atlas_terreno.png`).
- `pecas.json` e `arte/` (40 peças recortadas com `recorta_folha.py`, no máximo 128 cores).
- A cabana saiu numa peça só com a lenha e o totem; o poço saiu junto com as duas pedras rúnicas (colisão só no pé).
- As penas no chão estão no `ov` (são planas, o jogador anda por cima).
